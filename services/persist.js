function Model(cache, persistence){
	cache = cache || require('redis').createClient();
	persistence = persistence || require('mongoose').connect('mongodb://localhost/b2');
	var internalModel = {};

	Model.set= function(namespace, key, value){
		var keyStr;
		var Model;
		if(typeof key == 'string'){
			keyStr = key;
			key = {_id:keyStr};
		} else {
			keyStr = namespace + JSON.stringify(key);
		}
		internalModel[keyStr] = value;
		internalModel[keyStr].expiry = internalModel[keyStr].expiry || Date.now() + 10000;
		cache.set(keyStr, JSON.stringify(value));
		Model = mongoose.model(namespace);
		var model = Model.findOne(key);
		for(var key in value){
			model[key] = value[key];
		}
		model.save();

	}

	Model.get = function(namespace, key, cb){
		var keyStr;
		if(typeof key == 'string'){
			keyStr = key;
			key = {_id:keyStr};
		} else {
			keyStr = namespace + JSON.stringify(key);
		}

		if(internalModel[key]){
			internalModel[keyStr].expiry = Date.now() + 10000;
			return cb(null, internalModel[keyStr]);
		} else {
			cache.get(keyStr, function(err, reply){
				var Model;
				if(err) {
					Model = mongoose.model(namespace);
					Model.find(key, function(err, res){
						if(err) {
							return cb(err, null);
						} else {
							return cb(null, res);	
						}
					});
				} else {
					return cb(null, reply);
				}
			})
		}
	}

	function gc(){
		for(var key in internalModel) {
			if(!isFinite(internalModel[key].expiry) || internalModel[key].expiry < Date.now()){
				delete internalModel[key];
			}
		}
		setTimeout(gc,1000);
	}
	gc();
}

module.exports=Model;