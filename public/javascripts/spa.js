var Spa = {
  setUpRoute: function (path, component) {
    this.routes[path] = component;
  },

  defineComponent: function (componentHandlebarsStr, helperFn) {
    // return a constuctor function that will render component
    return function ComponentConstructor(replaceOrAppendObj, obj) {
      // 1. build the element
      var componentTemplate = Handlebars.compile(componentHandlebarsStr);
      var componentHtml = componentTemplate(obj === undefined ? {} : obj);
      var $el = $(componentHtml);

      // 2. call the helper function
      var rerenderFn = function (obj) {
        ComponentConstructor({ $elToReplace: $el }, obj);
      };
      if (helperFn !== undefined) {
        helperFn($el, rerenderFn, obj || {});
      }

      // 3. build the sub-components
      $el.find('[data-component]').each(function () {
        var componentName = $(this).attr('data-component');
        var Component = window[componentName];
        new Component({ $elToReplace: $(this) });
      });

      // 4. add the element to the DOM
      if (replaceOrAppendObj.$elToReplace !== undefined) {
        replaceOrAppendObj.$elToReplace.replaceWith($el);
      } else {
        replaceOrAppendObj.$elToAppendTo.append($el);
      }
    };
  },

  routes: {}
};

function renderTopLevelComponent() {
  $('body').empty();

  var Component = Spa.routes[window.location.pathname];
  new Component({ $elToAppendTo: $('body') });
}

// run this callback function whenever any <a> tag is clicked
$('body').on('click', 'a', function (eventObj) {
  // this cosmetically updates the URL
  // Note: eventObj.target is the element that was clicked
  var path = $(eventObj.target).attr('href');
  history.pushState({}, '', path);

  // this finds the component associated with the given path
  // and renders it into the <body>
  renderTopLevelComponent();

  // default behavior for a click event is to seny a synchronous
  // request to the server; we want to prevent that from happening
  eventObj.preventDefault();
});

// first thing that happens when window loads
// finds component that corresponds to current url
//  then renders that component into body
$(window).on('load', function () {
  renderTopLevelComponent();
});

// create handlebars helper called 'component'
// that will return a div with a data-component attribute
// that points to the name of the component
// later, this div can be replaced with component element itself
Handlebars.registerHelper('component', function (componentStr) {
  return new Handlebars.SafeString(`<div data-component="${componentStr}"></div>`);
});
