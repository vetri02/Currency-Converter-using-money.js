var cc = {
	init:function(){
		//set initial values for fx.rates and fx.base override when json arrives
		fx.base = "USD";
		fx.rates = {
			"EUR" : 0.74510096, // eg. 1 USD === 0.74510096 EUR
			"GBP" : 0.64771034,
			"HKD" : 7.78191949,
			"USD" : 1,          // always include the base rate (1:1)
			/* etc */
		}
		this.jsonData = null;
		this.selectFrom = document.getElementById("fromSelect");
		this.selectTo = document.getElementById("toSelect");
		
		this.keys = [];
		this.values = [];
		this.jsonManipulate();
	},
	jsonManipulate:function(){
		// Load exchange rates data via the cross-domain/AJAX proxy:
		    $.getJSON(
		        'http://openexchangerates.org/latest.json',
		        function(data) {
					//console.log(data)
					cc.jsonData = data;
		            // Check money.js has finished loading:
		            if ( typeof fx !== "undefined" && fx.rates ) {
		                fx.rates = data.rates;
		                fx.base = data.base;
		            } else {
		                // If not, apply to fxSetup global:
		                var fxSetup = {
		                    rates : data.rates,
		                    base : data.base
		                }
		            }
					//console.log(this.jsonData)
					//cc.buildSelectBox();
		        	cc.buildOptionBox();
				}
		    );
		
	},
	buildSelectBox:function(){
		   this.curValue = this.jsonData.rates
			console.log(this.curValue);
		   for(var key in this.curValue){
		      this.keys.push(key);	
		   }
		   for(var i=0;i<=this.keys.length;i++){
			 var objOption = document.createElement("option");
			  objOption.text = this.keys[i];
			  objOption.value = this.keys[i];
			  document.getElementById("fromSelect").add(objOption);
		   }
		   for(var i=0;i<=this.keys.length;i++){
			 var objOption = document.createElement("option");
			  objOption.text = this.keys[i];
			  objOption.value = this.keys[i];
			  document.getElementById("toSelect").add(objOption);
		   }
			this.fromValue = document.getElementById("fromSelect").value;
			this.toValue = document.getElementById("toSelect").value;
			
			$("#fromSelect").change(
				function(){cc.fromValue = this.value; cc.from();}
			);
			$("#toSelect").change(
				function(){cc.toValue = this.value; cc.to();}
			);
			$("#go").click(function(){
				cc.showRes();
				}	
			);
			//this.showRes();
			
	},
	buildOptionBox:function(){
			$.getJSON(
		        'js/currencies.json',
		        function(data) {
					this.curValue = jQuery.parseJSON(data);
						console.log(this.curValue);
					   for(var key in data){
					      cc.keys.push(key);
							console.log(cc.keys);
					   }
						for(var key in data){
						      cc.values.push(data[key]);
								console.log(data[key]);
				   	   }
					for(var i=0;i<cc.keys.length;i++){
						 var objOption = document.createElement("option");
						  objOption.text = cc.keys[i]+"-"+cc.values[i];
						  objOption.value = cc.keys[i];
						  document.getElementById("fromSelect").add(objOption);
					   }
					   for(var i=0;i<cc.keys.length;i++){
						 var objOption = document.createElement("option");
						  objOption.text = cc.keys[i]+"-"+cc.values[i];
						  objOption.value = cc.keys[i];
						  document.getElementById("toSelect").add(objOption);
					   }
						//$("#fromSelect").chosen();
						//$("#toSelect").chosen();
						cc.fromValue = document.getElementById("fromSelect").value;
						cc.toValue = document.getElementById("toSelect").value;

						$("#fromSelect").chosen().change(
							function(){cc.fromValue = this.value; cc.from();}
						);
						$("#toSelect").chosen().change(
							function(){cc.toValue = this.value; cc.to();}
						);
						$("#go").click(function(){
							cc.showRes();
							}	
						);
						//this.showRes();
				}
			);
	},
	from:function(){
		console.log(this.fromValue)
		this.showRes();
	},
	to:function(){
		console.log(this.toValue)
		this.showRes();
	},
	showRes:function(){
		fx.settings = { from: this.fromValue, to: this.toValue };
		console.log(fx.convert($("#amount").val()));
		$("#result").text(fx.convert($("#amount").val()))
	}
	
};

cc.init();