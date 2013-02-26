/*
	Utils - db library
*/
module.exports = function(){
	var self = this,
		SELECT = '',
		FROM = '',
		JOIN = '',
		WHERE = '',
		ORDER = '',
		GROUPBY = '',
		LIMIT = '',
		findTotal = false,
		whereParams = [];

	self.setFindTotal = function(val){ findTotal = val; }
	self.getFindTotal = function(){ return findTotal; }

	self.addSelect = function( selectStr ){
		SELECT += selectStr+' \n';
	};

	self.addFrom = function( fromStr ){
		if(FROM) FROM+=', ';
		FROM += fromStr+' \n';
	};

	self.addJoin = function( joinStr ){
		JOIN += joinStr+' \n';
	};

	self.addWhere = function( whereStr, whereAttr, prefix ){
		if(WHERE) WHERE+=' AND ';
		if(prefix) whereStr = '`'+prefix+'`.'+whereStr;
		WHERE += whereStr+' \n';
		whereParams.push(whereAttr);
	};

	self.addGroupBy = function( groupStr ){
		GROUPBY += groupStr+' \n';
	};

	self.addOrder = function( orderStr ){
		ORDER += orderStr+' \n';
	};

	self.addLimit = function( limitStr ){
		LIMIT += limitStr;
	};

	self.getLimit = function(){
		var str = 'LIMIT ';
	};

	self.setDefaultLimit = function(defaultLimit){
		LIMIT = LIMIT || 'LIMIT '+defaultLimit;
	}

	self.buildQuery = function( debug ){
		var fullQuery = 'SELECT ';
		if(findTotal) fullQuery += ' SQL_CALC_FOUND_ROWS ';
		fullQuery += SELECT;
		fullQuery += 'FROM '+FROM;
		if(JOIN) fullQuery += JOIN;
		if(WHERE) fullQuery += 'WHERE '+WHERE;
		if(GROUPBY) fullQuery += 'GROUP BY '+GROUPBY;
		if(LIMIT) fullQuery += LIMIT;

		if(debug) console.log(fullQuery);
		return fullQuery;
	};

	self.getParams = function( debug ){
		if(debug) console.log(whereParams);
		return whereParams;
	};

	self.buildParams = function(query, list){
		list.forEach( function(item){
	        if(query[item.param]){
	        	if(!item.type) self.addWhere(item.param+' = ? ', query[item.param]);
	        	else{
	        		console.log('in else');
	        		switch(item.type){
	        			case '=':
	        				item.prefix ? 	self.addWhere(item.param+' = ? ', query[item.param], item.prefix) :
	        								self.addWhere(item.param+' = ? ', query[item.param]);
	        				break;
	        			case 'like':
	        				item.prefix ? 	self.addWhere(item.param+' LIKE ? ', '%'+query[item.param]+'%', item.prefix) :
	        								self.addWhere(item.param+' LIKE ? ', '%'+query[item.param]+'%');
	        				break;
	        		}
	        	}
	        }
	    });
	};

	self.foundRows = function(dbConn, callback){
		dbConn.query('SELECT FOUND_ROWS()', function(err, total){
			callback(total[0]['FOUND_ROWS()']);
		});
	}
}