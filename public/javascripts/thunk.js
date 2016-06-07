var HomeComponent = Spa.defineComponent(`
  <div class="app">
    {{component "HeaderComponent"}}
    {{component "ThoughtInputComponent"}}
    {{component "ThoughtsListComponent"}}
  </div>`
);

var HeaderComponent = Spa.defineComponent(`
  <div class="header">
    <div class="header-icon"></div>
    Thunk!
    {{component "UserMenuComponent"}}
  </div>`
);

var UserMenuComponent = Spa.defineComponent(`
  <div class="user-menu">
    {{#if usernameLoaded}}
      {{username}}
    {{/if}}
    {{component "UserMenuDropdownComponent"}}
  </div>`,
  function ($userMenu, rerender, obj) {
    $userMenu.hover(function () {
      $userMenu.find('.user-menu-dropdown').css('display', 'flex');
    }, function () {
      $userMenu.find('.user-menu-dropdown').css('display', 'none');
    });

    if (!obj.usernameLoaded) {
      $.ajax({
        method: 'GET',
        url: '/users',
        success: function (response) {
          rerender({
            usernameLoaded: true,
            username: response.user.username
          });
        }
      });
    }
  }
);

var UserMenuDropdownComponent = Spa.defineComponent(`
  <div class="user-menu-dropdown">
    <a class="user-menu-dropdown__item" href="/">Home</a>
    <a class="user-menu-dropdown__item" href="/settings">Settings</a>
    <a class="user-menu-dropdown__item" href="/reminders">Reminders</a>
    <a class="user-menu-dropdown__item" href="/logout">Logout</a>
  </div>
`);

var ThoughtInputComponent = Spa.defineComponent(`
  <div class="thought-input">
    <textarea class="text-input" placeholder="Put down your thought..."></textarea>
    <div class="image-selection">
        <div class="image-selection__image">
      <div class="image-selection__text-overlay">{{textAreaVal}}</div>
        </div>
      <div class="image-selection-buttons">
        <button class="button image-selection__button new-image-button">New Image</button>
        <button class="button image-selection__button no-image-button">No Image</button>
      </div>
      <button class="button record-button">Record Thought and Image</button>
    </div>
  </div>`,
  function ($thoughtInput, rerender, obj) {
    // `focus` event fires when you click into an input or textarea
    // `blur` event fires when you click out of an input or textarea
    // `keydown` event fires when you press down a key inside an input or textarea
    // `keyup` event fires when you release a key inside an input or textarea
    var $textInput = $thoughtInput.find('.text-input');
    $textInput.val(obj.storedText);
    setTimeout(function () {
      $textInput.focus();
      $textInput.get(0).setSelectionRange(obj.selectionStart, obj.selectionEnd);
    }, 1);

    $textInput.on('keyup', function () {
      var storedText = $thoughtInput.find('.text-input').val();
      if ($textInput.val().length > 0) {
        rerender({
          storedText: storedText,
          selectionEnd: this.selectionEnd,
          selectionStart: this.selectionStart,
          textAreaVal: $('body').find('.text-input').val()
        });
      } else {
        rerender({
          storedText: storedText,
          selectionEnd: this.selectionEnd,
          selectionStart: this.selectionStart
        });
      }
    });
  }
);

var ThoughtsListComponent = Spa.defineComponent(`
  <div class="thoughts-list">
    {{#if dataLoaded}}
      {{#each thoughts as |thought|}}
        <div class="thought">
          <div class="thought__date">{{formatDate thought.createdAt}}</div>
          <div class="thought__image" style="background-image:url('{{thought.imageUrl}}')">
            <div class="thought__text">{{thought.content}}</div>
          </div>
        </div>
      {{/each}}
    {{else}}
      <div class="loading">Loading</div>
    {{/if}}
  </div>`,
  function ($el, rerender, obj) {
    if (!obj.dataLoaded) {
      $.ajax({
        method: 'GET',
        url: '/thoughts',
        success: function (response) {
          rerender({
            dataLoaded: true,
            thoughts: response.thoughts
          });
        }
      });
    }
  }
);

var SettingsComponent = Spa.defineComponent(`
  <div class="settings">
    {{component "HeaderComponent"}}
    {{component "SettingsFormComponent"}}
  </div>
`);

var SettingsFormComponent = Spa.defineComponent(`
  <div class="settings-form">
    <div class="settings-form__question>What would you like to change?</div>
    <div class="settings-form__choice-container">
      <div class="settings-form__choice--text">email:</div>
      <textarea class="settings-form__choice--textinput" placeholder="Enter new email"></textarea>
    </div>
    <div class="settings-form__choice-container">
      <div class="settings-form__choice--text">password:</div>
      <textarea class="settings-form__choice--textinput" placeholder="Enter new password"></textarea>
    </div>
    <div class="settings-form__choice-container">
      <div class="settings-form__choice--text">phone number:</div>
      <textarea class="settings-form__choice--textinput" placeholder="Enter new phone number"></textarea>
    </div>
    <div class="settings-form__submit-container submit-container">
      <button class="button submit-changes-button">Submit</button>
    </div>
  </div>
`);

var RemindersComponent = Spa.defineComponent(`
  <div class="reminders">
    {{component "HeaderComponent"}}
    {{component "RemindersFormComponent"}}
  </div>
`);

var RemindersFormComponent = Spa.defineComponent(`
  <div class="reminders-form">
    <div class="reminders-form__choice-container">
      <div class="reminders-form__choice--text">How often would you like to receive a thought?</div>
      <textarea class="reminders-form__choice--select-frequency" placeholder="Make a selection!"></textarea>
    </div>
    <div class="reminders-form__choice-container">
      <div class="reminders-form__choice--text">At what time?</div>
      <textarea class="reminders-form__choice--select-time" placeholder="Make a selection!"></textarea>
    </div>
    <div class="reminders-form__submit-container  submit-container">
      <button class="button submit-changes-button">Submit</button>
    </div>
  </div>
`);

var LoginComponent = Spa.defineComponent(`
  <div class="login">
    <div class="login-image"></div>

    <button class="button login__new-user--button">I'm new to thunking.</button>

    {{#if showNewUserFields}}
      <div method="POST" action="/create-user" class="login__new-user">
        <div class="login__input-container new-user-data__container">
          <div class="login__input--text">What's your email?</div>
          <textarea class="login__input new-user-email" placeholder="Enter email."></textarea>
        </div>
        <div class="login__input-container new-user-data__container">
          <div class="login__input--text">Imagine a fantastic username...</div>
          <textarea class="login__input new-user-username" placeholder="MegaDirible87883...Anyone?  Anyone?"></textarea>
        </div>
        <div class="login__input-container new-user-data__container">
          <div class="login__input--text">Scheme up a ridiculously complicated password...</div>
          <textarea class="login__input new-user-password" placeholder="What\'d you come up with??"></textarea>
        </div>
        <div class="login__input-container new-user-data__container">
          <div class="login__input--text">And a phone number to receive texts...</div>
          <textarea class="login__input new-user-phone-number" placeholder="XXX-XXX-XXXX"></textarea>
        </div>
        <div class="login__submit-container new-user-data__container">
          <button class="button create-user-button">Submit</button>
        </div>
      </div>
    {{/if}}

    <button class="button returning-user--button">I've been thunking for a while now.</button>

    {{#if showExistingUserFields}}
      <div class="login__returning-user">
        <div class="login__input-container returning-user-data__container">
          <div class="login__input--text">My name is Iniego Montolla.</div>
          <textarea class="login__input returning-username-input" placeholder="Enter username."></textarea>
        </div>
        <div class="login__input-container returning-user-data__container">
          <div class="login__input--text">The codeword is \'googly-eyed\'.</div>
          <textarea class="login__input returning-password-input" placeholder="Enter your password. Not \'googly-eyed\'."></textarea>
        </div>
        <div class="login__submit-container returning-user-data__container submit-container">
          <button class="button submit-changes-button login-returning-user--button">Submit</button>
        </div>
      </div>
    {{/if}}
  </div>`,
  function ($login, rerender) {
    // clicking new user displays new user login fields
    $login.find('.login__new-user--button').on('click', function () {
      rerender({ showNewUserFields: true, showExistingUserFields: false });
    });

    $login.find('.returning-user--button').on('click', function () {
      rerender({ showNewUserFields: false, showExistingUserFields: true });
    });

    $login.find('.create-user-button').on('click', function () {
      var dataFromTextAreas = {
        username: $('.new-user-username').val(),
        email: $('.new-user-email').val(),
        password: $('.new-user-password').val(),
        phoneNumber: $('.new-user-phone-number').val()
      };

      $.ajax({
        method: 'post',
        url: '/users',
        data: JSON.stringify(dataFromTextAreas),
        contentType: 'application/json',
        success: function (response) {
          window.location = '/';
        },
        error: function(xhr, status, error) {
          console.log('error', error);
        }
      });
    });

    $login.find('.login-returning-user--button').on('click', function () {
      var dataFromTextAreas = {
        username: $('.returning-username-input').val(),
        password: $('.returning-password-input').val(),
      };
      $.ajax({
        method: 'post',
        url: '/sessions',
        data: JSON.stringify(dataFromTextAreas),
        contentType: 'application/json',
        success: function (response) {
          window.location = '/';
        },
        error: function(xhr, status, error) {
          console.log('error', error);
        }
      });
    });
  }
);

var LogoutComponent = Spa.defineComponent(`
  <div class="logout">
    <div class="logout-image"></div>
    <div class="logout-text">Goodbye! Come back with another great thought soon!</div>
    <a class="log-back-in-button" href="/login">Log back in</a>
  </div>
`);

Spa.setUpRoute('/', HomeComponent);
Spa.setUpRoute('/settings', SettingsComponent);
Spa.setUpRoute('/reminders', RemindersComponent);
Spa.setUpRoute('/login', LoginComponent);
Spa.setUpRoute('/logout', LogoutComponent);

Handlebars.registerHelper("formatDate", function (dateStr) {
  return new Date(dateStr).toDateString();
});
