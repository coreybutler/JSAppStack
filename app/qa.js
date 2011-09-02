var cfg = {
	db: 'http://localhost' //CouchDB
};


Ext.require(['Ext.data.*', 'Ext.grid.*']);


//Questions & Answers
Ext.define('Question',{
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: '_id',	optional: false, defaultValue: null, type: 'string' },
		{ name: '_rev',	optional: true, defaultValue: null, type: 'string' },
		{ name: 'q',	optional: true, defaultValue: null, type: 'string' },
		{ name: 'a',	optional: true, defaultValue: null, type: 'string' }
	],
	
	proxy: {
		
		url: cfg.db,
		type: 'rest',
		appendId: true,
		noCache: false,
		
		
		//Unnecessary features for CouchDB
		directionParam:'',
		filterParam:'',
		groupParam:'',
		limitParam:'',
		pageParam:'',
		directionParam:'',
		sortParam:'',
		startParam:'',
		cacheString:'',
		
		
		//ID values are specific in CouchDB
		idProperty: '_id',
		
		
		/**
		 * CouchDB uses specific URL's for REST services.
		 * Please note the read URL. In order to return all of
		 * the questions stored in CouchDB, a design object 
		 * must be available. In CouchDB, this is a pre-defined
		 * map/reduce document. 
		 * 
		 * The map/reduce query document for CouchDB can be
		 * found at https://gist.github.com/1186538 
		 */
		api: {
			create: '/futurejs',
			read:	'/futurejs/_design/questions/_view/all',
			update:	'/futurejs',
			destroy:'/futurejs'
		},
		
		/**
		 * Custom Data Reader for CouchDB JSON
		 * Example raw result from CouchDB
		 * 	{
		 *	    total_rows: 1,
		 *	    offset: 0,
		 *	    rows: [
		 *	        {
		 *	            id: 'touchcount',
		 *	            key: null,
		 *	            value: {
		 *	                _id: 'touchcount',
		 *	                _rev: '2-9ec6adfe249e03a72a636af5ccc4e8f7',
		 *	                q: 'Have you used Sencha Touch?',
		 *	                a: 0
		 *	            }
		 *	        }
		 *	    ]
		 *	}
		 *
		 */
		reader: {
			type: 'json',
			root: 'rows',
			record: 'value',
			idProperty: '_id',
			successProperty: 'ok',
			totalProperty: 'total_rows'
		},
		
		//Custom Writer
		writer: {
			allowSingle: true,
			encode: false,
			writeAllFields: true,
			root: ''
		}
	},
	
	idProperty: '_id',
	
	validations:[{
		type:'length',
		field:'q',
		min:1
	}]
});



    
    
    
//View
Ext.onReady(function(){

	//Data Store
	var store = new Ext.data.Store({
		    model: 'Question'
		});
		
	store.load();
	
	//Row Editor Plugin for Grid
	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');

	//Question list
	var	questions =	Ext.create('Ext.grid.GridPanel',{
			renderTo: 'questionList',
			plugins: [rowEditing],
			width: 400,
	        height: 300,
	        frame: true,
	        title: 'Questions',
	        store: store,
	        hideHeaders: true,
	        columns: [{
	        	xtype:'rownumberer'
	        },{
	            flex: 1,
	            sortable: true,
	            dataIndex: 'q',
	            field: {
	                xtype: 'textfield'
	            }
	        }],
	        dockedItems: [{
	            xtype: 'toolbar',
	            items: [{
	                text: 'Add',
	                iconCls: 'icon-add',
	                handler: function(){
	                    // empty record
	                    store.insert(0, new Question());
	                    rowEditing.startEdit(0, 0);
	                }
	            }, '-', {
	                itemId: 'delete',
	                text: 'Delete',
	                iconCls: 'icon-delete',
	                disabled: true,
	                handler: function(){
	                    var selection = questions.getView().getSelectionModel().getSelection()[0];
	                    if (selection) {
	                    	Ext.Msg.confirm("Remove Question","Are you sure you wish to remove this question?",function(btn){
	                    		if ( btn == "yes" ) {
		                    		store.remove(selection);
		                    		store.sync();
		                    	}
	                    	});
	                    }
	                }
	            }, '->', {
	            	iconCls: 'icon-save',
                    itemId: 'save',
                    text: 'Save',
                    disabled: false,
                    scope: this,
                    handler: function(){
                    	store.sync();
                    }
	            }]
	        }]
		});
		
		questions.getSelectionModel().on('selectionchange', function(selModel, selections){
	        questions.down('#delete').setDisabled(selections.length === 0);
	    });
	
});
