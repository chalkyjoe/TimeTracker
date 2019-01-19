function save_options() {
      var username = document.getElementById('username').value;
      var accessCode = document.getElementById('accessCode').value;
      var meetingTicketNo = document.getElementById('meetingTicketNo').value;
      var dayLength = document.getElementById('dayLength').value;
      var baseURL = document.getElementById('baseURL').value;
      
      chrome.storage.sync.set({
        username: username,
        accessCode: accessCode,
        meetingTicketNo: meetingTicketNo,
        dayLength: dayLength,
        baseURL: baseURL
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });
    }

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    function restore_options() {
      // Use default value color = 'red' and likesColor = true.
      chrome.storage.sync.get({
        username: 'firstname.lastname@udgroup.co.uk',
        accessCode: '',
        meetingTicketNo: 'UDGINT1-6',
        dayLength: '8h',
        baseURL: 'udgroup.atlassian.net'
      }, function(items) {
        document.getElementById('username').value = items.username;
        document.getElementById('accessCode').value = items.accessCode;
        document.getElementById('meetingTicketNo').value = items.meetingTicketNo;
        document.getElementById('dayLength').value = items.dayLength;
        document.getElementById('baseURL').value = items.baseURL;

      });
    }
    document.addEventListener('DOMContentLoaded', restore_options);
    document.getElementById('save').addEventListener('click',
        save_options);