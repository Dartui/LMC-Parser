$(document).ready(function() {
	$("#parse").click(function() {
		if (!$("#copy").hasClass("disabled")) {
			$("#copy").addClass("disabled");
		}
		$("#lmc_output").val("");
		
		if ($("#lmc_data").val().length == 0) {
			return;
		}
		
		var dat_fields = new Array();
		var isHalted = false;
		var output = "";
		var data = $("#lmc_data").val().trim().split('\n');
		var error = false;
		
		for (var i = 0; i < data.length; i++) {
			var e = data[i] = data[i].trim();
			if (e.length == 0) {
				error = true;
				break;
			}
			var id = parseInt(e[0]);
			var val = parseInt(e.substring(1));
			if (id == 1 || id == 2 || id == 3 || id == 5) {
				if (dat_fields.indexOf(val) === -1 && dat_fields.indexOf(i) === -1) {
					dat_fields.push(val);
				}
			}
		}
		
		if (error) {
			alert("Proszę wprowadzić poprawne dane z \"RAMu\"");
			return;
		}
		
		dat_fields.sort();
		
		for (var i = 0; i < data.length; i++) {
			var e = data[i];
			var id = parseInt(e[0]);
			var val = parseInt(e.substring(1));
			if (dat_fields.indexOf(i) !== -1) {
				output += '\t' + "DAT " + e + '\n';
			} else if (e == "000") {
				if (!isHalted) {
					output += '\t' + "HLT" + '\n';
					isHalted = true;
				}
				continue;
			} else {
				var name = getCode(e);
				if (name.output === false) {
					alert("Błąd: " + name.code + ".\nOpis błędu: " + name.description + "\nLinia z błędem: " + (i+1) + "\nNiepoprawna wartość: " + e);
					continue;
				}
				output += '\t' + name.output + " " + '\n';
			}
		}
		
		$("#lmc_output").val(output);
		if ($("#lmc_output").val().length > 0) {
			$("#copy").removeClass("disabled");
		}
		//console.log(dat_fields);
	});
	
	function getCode(number) {
		if (!/^(-[\d]{1,3}|[\d]{1,3})$/.test(number)) {
			return {
				'output': false,
				'code': 'Niepoprawny format danych',
				'description': 'Dane powinny składać się z maksymalnie 3 cyfr i maksymalnie jednego minusa na początku'
			};
		}
		var id = parseInt(number[0]);
		var val = number.substring(1);
		switch (id) {
			case 1:
				return {'output': "ADD " + val};
			case 2:
				return {'output': "SUB " + val};
			case 3:
				return {'output': "STA " + val};
			case 4:
				return {'output': false, 'code': 'Użycie kodu 4', 'description': 'Kod nr 4 wg dokumentacji jest jest wyłączony z użytku'};
			case 5:
				return {'output': "LDA " + val};
			case 6:
				return {'output': "BRA " + val};
			case 7:
				return {'output': "BRZ " + val};
			case 8:
				return {'output': "BRP " + val};
			case 9:
				if (number[1] == "2") {
					return {'output': "OTC"};
				} else if (number[2] == "1") {
					return {'output': "INP"};
				} else if (number[2] == "2") {
					return {'output': "OUT"};
				}
				return {'output': false, 'code': 'Niepoprawna instrukcja zaczynająca się od 9', 'description': 'Nie udało się rozpoznać akcji, jaka ma się wykonać z użyciem kodu 9.'};
			case 0:
				return {'output': false, 'code': 'Niezidentyfikowane pole', 'description': 'Nie udało się rozpoznać, do czego służy to pole. Zostanie pominięte'};
			default: return {'output': false, 'code': 'Nieznany błąd', 'description': 'Nie udało się rozpoznać błędu'};
		}
	}
	
	new Clipboard('#copy');
	
	$("#copy").popup({on: 'click'});
});
