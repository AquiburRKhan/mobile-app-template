var initialized = false;

function load_jquery()
{
	// Put jQuery Here
}

function init_jquery()
{
	if(initialized)
	{
		return false;
	}

	initialized = true;

	setTimeout(load_jquery, 250);
}

function title_case(str)
{
	return clean_string(str.replace(/\w\S*/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	}));
}

function clean_string(str)
{
	return str.replace(/[|&;$%@"<>()+,]/g, "").trim();
}

function phone_number(tel)
{
	if (!tel) { return ''; }

	var value = tel.toString().trim().replace(/^\+/, '');

	if (value.match(/[^0-9]/)) {
		return tel;
	}

	var country, city, number;

	switch (value.length) {
		case 10: // +1PPP####### -> C (PPP) ###-####
			country = 1;
			city = value.slice(0, 3);
			number = value.slice(3);
			break;

		case 11: // +CPPP####### -> CCC (PP) ###-####
			country = value[0];
			city = value.slice(1, 4);
			number = value.slice(4);
			break;

		case 12: // +CCCPP####### -> CCC (PP) ###-####
			country = value.slice(0, 3);
			city = value.slice(3, 5);
			number = value.slice(5);
			break;

		default:
			return tel;
	}

	if (country == 1) {
		country = "";
	}

	number = number.slice(0, 3) + '-' + number.slice(3);

	return (country + " (" + city + ") " + number).trim();
}

/**
 * Compare Current Version Number against latest_app_info.current_version
 * @param installed_version Current Version Number to Check Against
 * @param include_beta Whether we should check for possible beta builds too
 * @returns {number} How many versions behind the user is
 */
function compare_app_versions(installed_version, latest_app_info, include_beta)
{
	var start = null;
	var behind = 0;

	if(installed_version !== latest_app_info.current_version)
	{
		for(var i=0; i<latest_app_info.release.length; i++)
		{
			if(include_beta)
			{
				if(start === null && latest_app_info.release[i].version === latest_app_info.current_version)
				{
					start = i;
				}
				if(start !== null && installed_version < latest_app_info.release[i].version)
				{
					behind++;
				}
				if(start !== null && installed_version === latest_app_info.release[i].version)
				{
					break;
				}
			}
			else
			{
				if(start === null && latest_app_info.release[i].production_release === true  && latest_app_info.release[i].production_ios_release_date !== null && latest_app_info.release[i].production_android_release_date !== null && latest_app_info.release[i].version === latest_app_info.current_version)
				{
					start = i;
				}
				if(start !== null && latest_app_info.release[i].production_release === true  && latest_app_info.release[i].production_ios_release_date !== null && latest_app_info.release[i].production_android_release_date !== null && installed_version < latest_app_info.release[i].version)
				{
					behind++;
				}
				if(start !== null && latest_app_info.release[i].production_release === true  && latest_app_info.release[i].production_ios_release_date !== null && latest_app_info.release[i].production_android_release_date !== null && installed_version === latest_app_info.release[i].version)
				{
					break;
				}
			}
		}
	}

	return behind;
}