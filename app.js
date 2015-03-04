(function() {
  return {
    events: {
      // App lifecycle events
      'app.created':'init',
      // DOM events
      'click .start' : 'switchToInput',
      'click .createTicket': 'confirmAmount',
      'keyup #inputValueIdFirst': function(event){
        if(event.keyCode === 13)
          return this.confirmAmount();
      },
      'click .createTicketConfirm': 'createTicket',
      'keyup #inputValueIdSecond': function(event){
        if(event.keyCode === 13)
          return this.createTicket();
      },
      // Requests events
      'createTicketRequest.done': 'createTicketRequestDone',
      'createTicketRequest.fail': 'createTicketRequestFail'
    },
    requests: {
      createTicketRequest: function(ticket) {
        return {
          url: '/api/v2/tickets.json',
          // url: 'http://requestb.in/13biqn11',
          dataType: 'json',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            "ticket": {
              "subject": ticket.subject(),
              "comment": { 
                "body":  ticket.description()
              },
              "status": ticket.status(),
              "priority": ticket.priority(),
              "type": ticket.type(),
              "tags": ticket.tags(),
              "assignee_id": this.currentUser().id(),
              "requester_id": this.currentUser().id()
            }
          })
        };
      }
    },
    init: function() {
      this.switchTo('main');
    },
    switchToInput: function() {
      this.switchTo('create');
    },
    confirmAmount: function() { // Add code to disable button unless value entered is correct
      var inputValueFirst          = parseInt(this.$('input#inputValueIdFirst').val(), 10),
          maximum             = parseInt(this.setting('Creation Limit'), 10);

      if (isNaN(inputValueFirst) === false) { // If value entered is a number
        if (inputValueFirst < maximum+1) { // If value entered is less than the set ticket creation limit
          services.notify('Please confirm the number of tickets to create', 'alert');
          this.switchTo('confirm', { // Only switch to Confirm template if value entered is an permissible value
            numberOfTicketsToCreate: inputValueFirst
          });
        } else {
          services.notify('Can only create up to <strong>' + (maximum) + ' tickets</strong> at a time', 'error');
        }
      } else {
        services.notify('Value entered is not a number', 'error');
      }
      this.$('input#inputValueIdFirst').val(''); // Empty the input field
      this.inputValueFirst = inputValueFirst; // Set input value to the root of the app
    },
    createTicket: function() {
      var ticket              = this.ticket(),
          inputValueSecond    = parseInt(this.$('input#inputValueIdSecond').val(), 10),
          maximum             = parseInt(this.setting('Creation Limit'), 10),
          inputValueFirst     = this.inputValueFirst;

      if (inputValueFirst === inputValueSecond) { // If initial accepted value matches what is entered in confirm
        if (inputValueSecond === 1) { // Use the singular form of 'copy' if user only creates one copy
          services.notify('Creating <strong>' +inputValueSecond + '</strong> copy of this ticket', 'notice');
          this.switchTo('loading');
          // send requests
          services.notify('Created <strong>' +inputValueSecond + '</strong> copy of this ticket', 'notice');
          this.switchTo('main');
        } else {
          services.notify('Creating <strong>' +inputValueSecond + '</strong> copies of this ticket', 'notice');
         this.switchTo('loading');
         // send requests
          services.notify('Created <strong>' +inputValueSecond + '</strong> copies of this ticket', 'notice');
          this.switchTo('main');
        }
      } else {
        services.notify('You entered <strong>' + inputValueSecond + '</strong>, please enter <strong>' + inputValueFirst + '</strong> to proceed', 'error');
      }
      inputValueSecond = this.$('input#inputValueIdSecond').val(''); // Empties input field 
    }

// TESTING start    
    // createTicketRequestDone: function(data){
    //   console.log(data);
    //   this.switchTo('creationComplete', {
    //     id: data.ticket.id
    //   });
    // },
    // createTicketRequestFail: function(data){
    //   console.log(data);
    // }
// TESTING end

  };
}());