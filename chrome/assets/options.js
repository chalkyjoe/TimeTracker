var urlParams = new URLSearchParams(window.location.search);
var errorCode = urlParams.get('errorCode');
var firstTime = urlParams.get('firstTime');

function save_options() {
      var fields = [
        { name: 'username', isValid: true, value: '' },
        { name: 'accessCode', isValid: true, value: '' },
        { name: 'meetingTicketNo', isValid: true, value: '' },
        { name: 'dayLength', isValid: true, value: '' },
        { name: 'baseURL', isValid: true, value: '' },
      ]
      var username = $('#username');
      var accessCode = $('#accessCode');
      var meetingTicketNo = $('#meetingTicketNo');
      var dayLength = $('#dayLength');
      var baseURL = $('#baseURL');
      var corsEverywhere = $('#corsEverywhere');
      
      validate_token(corsEverywhere.val(), username.val(), accessCode.val(), baseURL.val(), data => {
        username.removeClass('inputError').removeClass('inputSuccess');
        accessCode.removeClass('inputError').removeClass('inputSuccess');
        meetingTicketNo.removeClass('inputError').removeClass('inputSuccess');
        dayLength.removeClass('inputError').removeClass('inputSuccess');
        baseURL.removeClass('inputError').removeClass('inputSuccess');

        var canConnect = data['displayName'];
        var dayLengthValid = validate_dayLength(dayLength.val());
        var meetingTicketNoValid = validate_meetingTicketNo(meetingTicketNo);

        var myNewURL = window.location.pathname;
        window.history.pushState("", "", myNewURL );

        showFieldValidation('corsEverywhere', canConnect, 'Cannot connect to Atlassian.');
        showFieldValidation('username', canConnect, 'Cannot connect to Atlassian.');
        showFieldValidation('accessCode', canConnect, 'Cannot connect to Atlassian.');
        showFieldValidation('baseURL', canConnect, 'Cannot connect to Atlassian.');
        showFieldValidation('dayLength', dayLengthValid, 'Day Length invalid.');
        showFieldValidation('meetingTicketNo', meetingTicketNoValid, 'Not a ticket ID');

        if (!meetingTicketNoValid || !dayLengthValid || !canConnect) return;

        chrome.storage.sync.set({
          username: username.val(),
          accessCode: accessCode.val(),
          meetingTicketNo: meetingTicketNo.val(),
          dayLength: dayLength.val(),
          baseURL: baseURL.val(),
          corsEverywhere: corsEverywhere.val()
        }, function() {
          var status = $('#status');
          status.html('Options saved.');
          setTimeout(function() {
            status.html('');
          }, 2000);
          restore_options();
        });
      });
    }

    function restore_options() {
      canConnect = errorCode == null;
      $('.welcomeText').toggle(firstTime != null);
      showFieldValidation('corsEverywhere', canConnect, 'Cannot connect to Atlassian.');
      showFieldValidation('username', canConnect, 'Cannot connect to Atlassian.');
      showFieldValidation('accessCode', canConnect, 'Cannot connect to Atlassian.');
      showFieldValidation('baseURL', canConnect, 'Cannot connect to Atlassian.');
      chrome.storage.sync.get({
        username: 'firstname.lastname@companyname.co.uk',
        accessCode: '',
        meetingTicketNo: 'UDGINT1-6',
        dayLength: '8h',
        baseURL: 'companyname.atlassian.net',
        corsEverywhere: 'localhost:8080',
        canConnect: false
      }, function(items) {
        $('#username').val(items.username);
        $('#accessCode').val(items.accessCode);
        $('#meetingTicketNo').val(items.meetingTicketNo);
        $('#dayLength').val(items.dayLength);
        $('#baseURL').val(items.baseURL);
        $('#corsEverywhere').val(items.corsEverywhere);
      });
    }
    function restore_defaults() {
      $('#username').val('firstname.lastname@companyname.co.uk');
      $('#accessCode').val('');
      $('#meetingTicketNo').val('UDGINT1-6');
      $('#dayLength').val('8h');
      $('#baseURL').val('companyname.atlassian.net');
      $('#corsEverywhere').val('localhost:8080')
    }
    function showFieldValidation(name, isValid, errorMessage)
    {
      var field = $('#' + name);
      var fieldErrorMessage = $('.' + name + '.error');
      if (isValid)
      {
        field.addClass('inputSuccess');
        fieldErrorMessage.hide();
      } else {
        field.addClass('inputError');
        fieldErrorMessage.show();
        fieldErrorMessage.html(errorMessage);
      }
    }
    // Validate time
    function validate_dayLength(time) {
      var regex = new RegExp(/^([1-2]*[0-9]h)*( )*([1-6]*[0-9]m)*( )*([1-6]*[0-9]s)*$/);
      return regex.test(time);
    }

    function validate_token(corsEverywhere, username, accessCode, baseURL, callback)
    {
        //var request = require('request');
        var url = `https://${baseURL}/rest/api/3/myself`;
        var token = btoa(`${username}:${accessCode}`);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            try {
                var data = JSON.parse(this.responseText);
                callback(data);
            } catch(err) {
                callback(err);
            }
          }
        });

        xhr.open("GET", `http://${corsEverywhere}/${url}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic ' + token);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.withCredentials = false;
        xhr.send();
    }
    function validate_meetingTicketNo(meetingTicketNo)
    {
      return true;
    }
    $(document).ready(restore_options);
    $('#save').on('click', save_options);
    $(document).keypress(function(e) {
      if (e.keyCode === 13) save_options();
    })
    $('#revert').on('click', restore_options);
    $('#restore').on('click', restore_defaults)