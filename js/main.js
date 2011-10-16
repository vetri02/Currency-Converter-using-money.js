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
		        	cc.buildOptionBox();
				}
		    );
		
	},
	buildOptionBox:function(){
			$.getJSON(
		        'js/currencies.json',
		        function(data) {
					this.curValue = jQuery.parseJSON(data);
					   for(var key in data){
					      cc.keys.push(key);
					   }
						for(var key in data){
						      cc.values.push(data[key]);
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
						cc.fromValue = document.getElementById("fromSelect").value;
						cc.toValue = document.getElementById("toSelect").value;

						$("#fromSelect").chosen().change(
							function(){cc.fromValue = this.value;}
						);
						$("#toSelect").chosen().change(
							function(){cc.toValue = this.value;}
						);
						$("#go").click(function(){
							cc.showRes();
							}	
						);
				}
			);
	},
	showRes:function(){
		fx.settings = { from: this.fromValue, to: this.toValue };
		//$("#toCur").text(this.toValue);
		this.money = fx.convert($("#amount").val());
		//console.log(accounting.formatMoney(cc.money, { symbol: cc.toValue,  format: "%v %s" }));
		$("#result").text(accounting.formatMoney(cc.money, { 
			symbol: cc.toValue,  
			format: {
				pos : "%v %s ",
				neg : "(%v) %s",
				zero: "-- %s"
			} 
		}));
		//fx.settings = { from: this.fromValue, to: this.toValue };
		//$("#result").text(fx.convert($("#amount").val()))
	}
	
};

cc.init();