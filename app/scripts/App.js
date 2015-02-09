(function() {
	var rootNode = document.querySelector('#shadow-host');

	/**
     * Shadow DOM demo
	 */

	var shadowRoot = rootNode.createShadowRoot(); 
	var shadowChild = document.createElement('div');
	shadowChild.innerHTML = "<span>I'am child</span>";
	shadowRoot.appendChild(shadowChild); 

	/**
     * Template Demo
	 */

	var tpl = document.querySelector('#my-tpl');
	var content = document.importNode(tpl.content, true);
	console.log(content);
	shadowRoot.appendChild(content);

	/**
     * Custom elements demo
	 */

	XCounterProto = Object.create(HTMLElement.prototype);

	XCounterProto.onChange = function() {
		console.log("changed");
	}

	XCounterProto.createdCallback = function() {

		console.log("CREATED!");
		var tpl = document.querySelector('#counter-tpl');
		var tplContent = document.importNode(tpl.content, true);

		this.__root = this.createShadowRoot();
		this.__root.appendChild(tplContent);
		
	}

	var pad = function(v) {
		return ("0" + v).slice(-2);
	}

	XCounterProto.attachedCallback = function() {
		
		console.log("ATTACHED!");

		this.counterBody = this.__root.querySelector('content');

		var changeTimer = function() {

			var timerContent = this.counterBody.getDistributedNodes()[0];

			var timerContentText = timerContent.innerHTML;
			var parts = timerContentText.split(":");
			console.log(parts);
			var minutes = parseInt(parts[0]);
			var seconds = parseInt(parts[1]);

			seconds -= 1;

			if (seconds <= 0 && minutes > 0) {
				minutes -= 1;
				seconds = 59;
			}
			
			console.log(minutes, seconds);

			if (minutes == 0 && seconds == 0) {
				console.log("CLOSE TIMER!");
				clearInterval(this.timer);
			}

			timerContent.innerHTML = pad(minutes) + ":" + pad(seconds);

			this.onChange();
		}

		this.timer = setInterval(changeTimer.bind(this), 1000);
	}

	XCounterProto.detachedCallback = function() {
		console.log("DETACHED!");
	}

	var XCounter = document.registerElement('x-counter', {prototype: XCounterProto});
	
	//var el = new XCounter();
	//document.body.appendChild(el);
})();