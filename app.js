(function() {
  return {
    customFieldRegExp: new RegExp(/custom_field_([0-9]+)/),
    dateRegExp : new RegExp(/([0-9]:00:00 GMT[+])/),  
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
      'createTicketRequest.always': 'createTicketRequestDone'
    },
    requests: {
      createTicketRequest: function(ticket, custom_fields, assignee_id) { // Create single ticket clone

        return {
          url: '/api/v2/tickets.json',
          // url: 'http://requestb.in/qhxubxqh',
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
              "assignee_id": assignee_id,
              "requester_id": ticket.requester().id(),
              "collaborator_ids": _.map(ticket.collaborators(), function(cc) { return cc.email(); }),
              "custom_fields": custom_fields
            }
          })
        };

      }
    },
    createTicketRequestDone: function(data){
      console.log('data.ticket.id:');
      console.log(data.ticket.id);
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
          services.notify('Please enter <strong>' + inputValueFirst + '</strong> to confirm', 'alert', 1000);
          this.switchTo('confirm', { // Only switch to Confirm template if value entered is an permissible value
            numberOfTicketsToCreate: inputValueFirst
          });
        } else {
          services.notify('Can only create up to <strong>' + (maximum) + ' tickets</strong> at a time', 'error', 1000);
        }
      } else {
        services.notify('Value entered is not a number', 'error', 800);
      }
      this.$('input#inputValueIdFirst').val(''); // Empty the input field
      this.inputValueFirst = inputValueFirst; // Set input value to the root of the app
    },
    createTicket: function() {
      var ticket              = this.ticket(),
          inputValueSecond    = parseInt(this.$('input#inputValueIdSecond').val(), 10),
          maximum             = parseInt(this.setting('Creation Limit'), 10),
          inputValueFirst     = this.inputValueFirst,
          custom_fields       = this.serializeCustomFields();

      if (ticket.assignee().user() === undefined) {
        var assignee_id = "";
      }

      this.inputValueSecond = inputValueSecond;          

      if (inputValueFirst === inputValueSecond) { // If initial accepted value matches what is entered in confirm
        if (inputValueSecond === 1) { // Use the singular form of 'copy' if user only creates one copy
          services.notify('Creating <strong>' + inputValueSecond + '</strong> copy of this ticket', 'notice', 500);
          this.switchTo('loading');
              for (var i = 0; inputValueSecond > i; i++) { // Make AJAX requests to create a ticket until i = number confirmed by user
                // console.log('loopinga');


                for (var z = 0; custom_fields.length > z; z++) {
                  
                  if (typeof custom_fields[z].value === 'object') {
                    
                    // console.log('OBJECT:');
                    // console.log(custom_fields[z].value);

                    var correctlyFormattedDateValueA = (((JSON.stringify(custom_fields[z].value)).split('"'))[1].split('T'))[0];
                    // console.log('correctlyFormattedDateValue:');
                    // console.log(correctlyFormattedDateValue);
                    // console.log('typeof correctlyFormattedDateValue:');
                    // console.log(typeof correctlyFormattedDateValue);

                    custom_fields[z].value = correctlyFormattedDateValueA;

                    // var obj = custom_fields[z].value;
                    // var string = JSON.stringify(obj);
                    // console.log('STRING:');
                    // console.log(string);
                    // console.log(typeof string);
                    // var split = string.split('"');
                    // console.log('split:');
                    // console.log(split);
                    // var getDateFromSplitString = split[1].split('T');
                    // console.log('getDateFromSplitString:');
                    // console.log(getDateFromSplitString);
                    // var correctlyFormattedDateValue = getDateFromSplitString[0];
                    // console.log('correctlyFormattedDateValue:');
                    // console.log(correctlyFormattedDateValue);
                    // console.log(typeof correctlyFormattedDateValue);

                    // custom_fields[z].value = correctlyFormattedDateValue;
                    // console.log('custom_fields[z].value:');
                    // console.log(custom_fields[z].value);

                  }

                  // console.log(custom_fields[z].value);

                }

                // console.log('custom_fields:');
                // console.log(custom_fields);


                this.ajax('createTicketRequest', ticket, custom_fields, assignee_id); // Include ticket object for use in ticket creation request
              }
          services.notify('Created <strong>' + inputValueSecond + '</strong> copy of this ticket', 'notice', 1500);
          this.switchTo('main');
        } else {
          services.notify('Creating <strong>' + inputValueSecond + '</strong> copies of this ticket', 'notice', 500);
          this.switchTo('loading');
          var reqs = [];
          console.log(this);
              for (var j = 0; inputValueSecond > j; j++) { // Make AJAX requests to create a ticket until i = number confirmed by user
                // console.log('loopingb');


                for (var f = 0; custom_fields.length > f; f++) {
                  
                  if (typeof custom_fields[f].value === 'object') {
                    
                    // console.log('OBJECT:');
                    // console.log(custom_fields[z].value);

                    var correctlyFormattedDateValueB = (((JSON.stringify(custom_fields[f].value)).split('"'))[1].split('T'))[0];
                    // console.log('correctlyFormattedDateValue:');
                    // console.log(correctlyFormattedDateValue);
                    // console.log('typeof correctlyFormattedDateValue:');
                    // console.log(typeof correctlyFormattedDateValue);

                    custom_fields[f].value = correctlyFormattedDateValueB;

                    // var obj = custom_fields[z].value;
                    // var string = JSON.stringify(obj);
                    // console.log('STRING:');
                    // console.log(string);
                    // console.log(typeof string);
                    // var split = string.split('"');
                    // console.log('split:');
                    // console.log(split);
                    // var getDateFromSplitString = split[1].split('T');
                    // console.log('getDateFromSplitString:');
                    // console.log(getDateFromSplitString);
                    // var correctlyFormattedDateValue = getDateFromSplitString[0];
                    // console.log('correctlyFormattedDateValue:');
                    // console.log(correctlyFormattedDateValue);
                    // console.log(typeof correctlyFormattedDateValue);

                    // custom_fields[z].value = correctlyFormattedDateValue;
                    // console.log('custom_fields[z].value:');
                    // console.log(custom_fields[z].value);

                  }

                  // console.log(custom_fields[z].value);

                }

                // console.log('custom_fields:');
                // console.log(custom_fields);




                reqs.push(this.ajax('createTicketRequest', ticket, custom_fields, assignee_id)); // Include ticket object for use in ticket creation request
              }
          this.when.apply(this, reqs).then(_.bind(function(){
            var inputValueSecond = this.inputValueSecond;
            // console.log('inputValueSecond:');
            // console.log(inputValueSecond);
            // console.log('applied');
            services.notify('Created <strong>' + inputValueSecond + '</strong> copies of this ticket', 'notice', 1500);
            this.switchTo('main');
          }, this));          
        }
      } else {
        services.notify('You entered <strong>' + inputValueSecond + '</strong>, please enter <strong>' + inputValueFirst + '</strong> to proceed', 'error', 500);
      }
      inputValueSecond = this.$('input#inputValueIdSecond').val(''); // Empties input field 
    },
    serializeCustomFields: function() {
      var fields = [];
      this.forEachCustomField(function(field){

        // console.log(field.value);

        if (field.value !== ""){
            var test = ""+field.value+"";
            var isDate = "";
            if(field.value !== undefined){
                isDate = test.match(this.dateRegExp);
            }else{

            }

                var value = "";
                if(isDate !== "" && isDate !== null){
                    var date = new Date(field.value);
                    var year = date.getFullYear();
                    var month = (1 + date.getMonth()).toString();
                    month = month.length > 1 ? month : '0' + month;
                    var day = date.getDate().toString();
                    day = day.length > 1 ? day : '0' + day;

                    value = year+"-"+month+"-"+day;
                }else{
                    value = field.value;
                }
          if (field.value !== null) { // Only save field ID & value is there is a value present
            
            fields.push({
                      id: field.id,
                      value: value
            });
          }
        }
      });
      return fields;
    },
    forEachCustomField: function(block){
      _.each(this._customFields(), function(field){
        var id = field.match(this.customFieldRegExp)[1],
            value = this.normalizeValue(this.ticket().customField(field));

            console.log(value);

        block.call(this, {
          label: field,
          id: id,
          value: value
        });
      }, this);
    },
    normalizeValue: function(value){
      return {
        "yes": true,
        "no": false
      }[value] || value;
    },
    _customFields: _.memoize(function(){
      return _.filter(_.keys(this.containerContext().ticket), function(field){
        return field.match(this.customFieldRegExp);
      }, this);
    })
  };
}());