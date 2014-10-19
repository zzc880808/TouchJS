
(function(){

    // Event queue
    var Event = function(){ this.q = {}; };
    Event.prototype = {
        _on: function(name, callback, context){
            var queue = this.q[name] || (this.q[name] = []);
            queue.push({ b:callback, c:context || this });
        },
        _off: function(name, callback, context){
            if (callback || context){
                var isCallbackMatch = callback && function(obj){ return obj.b === callback; } ||
                        function(){ return true; };
                var isContextMatch = context && function(obj){ return obj.c === context; } ||
                        function(){ return true; };
                if (name){
                    if (!this.q[name]) return;
                    for (var i = 0, queue = this.q[name]; i < queue.length; ++i)
                        isCallbackMatch(queue[i]) && isContextMatch(queue[i]) && queue.splice(i--, 1);
                } else {
                    for (var propName in this.q)
                        for (var i = 0, queue = this.q[propName]; i < queue.length; ++i)
                            isCallbackMatch(queue[i]) && isContextMatch(queue[i]) && queue.splice(i--, 1);
                }
            }
            else if (name && !callback && !context) this.q[name] && (this.q[name] = []);
            else this.q = {};
        },
        _trigger: function(name, args){
            var handler, tmp;
            if (this.q[name] && (tmp = this.q[name].slice(0)))
                while (handler = tmp.shift()) handler.b.apply(handler.c, args);
            if (name !== 'all' && this.q['all'] && (tmp = this.q['all'].slice(0)))
                while (handler = tmp.shift()) handler.b.apply(handler.c, args);
        },
        on : function(names, callback, context){
            var nameArr = names.split(' ');
            for (var i = nameArr.length; --i >= 0;) this._on(nameArr[i], callback, context);
        },
        off : function(names, callback, context){
            if (names){
                var nameArr = names.split(' ');
                for (var i = nameArr.length; --i >= 0;) this._off(nameArr[i], callback, context);
            } else {
                this._off(names, callback, context);
            }
        },
        trigger : function(names, args){
            var nameArr = names.split(' ');
            for (var i = nameArr.length; --i >= 0;) this._trigger(nameArr[i], args);
        }
    };

    var Touch = function(el){
        this.e = new Event();
    };

    var touch = function(el){
        return new Touch(el);
    };

    // var e = new Event();

    // e.on('aa bb cc', function(opts){
    //     console.log('callback', opts);
    // });

    // e.on('aa all', function(opts){
    //     console.log('aa all', opts);
    // })

    // e.off('bb aa');

    // e.trigger('aa cc');
    // e.trigger('bb', ['abke']);


})();
