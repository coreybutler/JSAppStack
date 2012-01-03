var cfg = {
	db: 'http://192.168.1.2/mongo' //MongoDB
};


Ext.require(['Ext.data.*', 'Ext.grid.*']);


//Questions & Answers
Ext.define('Question',{
	extend: 'Ext.data.Model',
	
	fields: [
		{ name: '_id',	optional: false, defaultValue: null, type: 'string' },
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
		
		
		//Custom Reader
		reader: {
			type: 'json',
			root: 'questions',
			idProperty: '_id',
			totalProperty: 'total_rows'
		}/*,
		
		
		//Custom Writer
		writer: {
			allowSingle: true,
			encode: false,
			writeAllFields: true,
			root: ''
		}*/
	},
	
	idProperty: '_id'
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
