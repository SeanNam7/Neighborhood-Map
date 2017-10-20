

//MODEL: your application’s stored data.




//VIEWMODEL = A pure-code representation of the data and operations on a UI
var myViewModel = {
    personName: 'Bob',
    personAge: 123
};



//VIEW: a visible, interactive UI representing the state of the view model.
//The name is <span data-bind="text: personName">Bob</span>



//Activating Knockout
//data-bind attribute + ko.applyBindings(myViewModel);