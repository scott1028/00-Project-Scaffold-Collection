$.prototype.desktop = function(opt1, otp2){
    var dom = '<div>{{version}}</div>';
    var link = $compile(dom);
    var node = link(this.scope());
    this.append(node);
    // debugger;
    console.log(this);
    console.log(this.scope());
    this.scope().version = 123;
    // this.scope().$apply();
};