function Sym(type, data) {
  this.type = type;
  this.data = data; 
}
Sym.prototype.equals = function(other) {
  return other.type === this.type && other.data === this.data;
}
Sym.prototype.toString = function(){ 
  return this.data.toString(); //return this.type + '(' + this.data + ')';
}

function NT(data) { return new Sym('NT', data); }
function T(data) { return new Sym('T', data); }


function Rule(name, production) {
  if(!(this instanceof Rule)) return new Rule(name, production);
  this.name = name; // LHS
  this.production = production; // RHS\
}
Rule.prototype.equals = function(other) {
  if(other.name !== this.name) return false;
  if(other.production.length !== this.production.length) return false;
  
  for(var i=0; i<other.production.length; ++i) {
    if(!other.production[i].equals(this.production[i])) return false;
  }
  return true;
}
Rule.prototype.toString = function(){
  return this.name + ' -> ' + this.production.join('');
}




function Grammar(rules) {
  if(!(this instanceof Grammar)) return new Grammar(rules);
  this.rules = rules;
  this.start = rules[0].name;
  this.symbolMap = {}; // initially just rules for each symbol; eventually can contain annotations like 'nullable'
  this.symbolsList = [];
  
  for(var i=0; i<this.rules.length; ++i) {
    var sym = this.rules[i].name;
    if(!(sym in this.symbolMap)) {
      this.symbolMap[sym] = {rules: []};
      this.symbolsList.push(sym);
    }
    this.symbolMap[sym].rules.push(this.rules[i]);
  }
}


// get a map from symbols to a list of the rules they appear in the RHS of
// if a symbol appears in a RHS more than once, that rule will appear more than once in the list
// modifies the grammar to have _reverseMap property, for caching
Grammar.prototype.getReverseMap = function() {
  if(!this.hasOwnProperty('_reverseMap')) {
    this._reverseMap = {};
    for(var i=0; i<this.symbolsList.length; ++i) {
      this._reverseMap[this.symbolsList[i]] = [];
    }
    for(var i=0; i<this.rules.length; ++i) {
      var rule = this.rules[i];
      for(var j=0; j<rule.production.length; ++j) {
        if(rule.production[j].type === 'NT') {
          this._reverseMap[rule.production[j].data].push(rule);
        }
      }
    }
  }
  
  return this._reverseMap;
}


module.exports = {
  Sym: Sym,
  NT: NT,
  T: T,
  Rule: Rule,
  Grammar: Grammar
}