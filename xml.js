var wrt, xml, xmlfilepath, xmlroot
var xmlremotelocation="users.xml"
// parser utilizes the SAXON Reader to have the XML read in with the appropriate format, pretty print, this is not necessary for functionality but makes the readability of the saved XML much better

function parser(path)
	{
	var rdr = new ActiveXObject("MSXML2.SAXXMLReader.3.0")
	wrt = new ActiveXObject("MSXML2.MXXMLWriter.3.0")
	wrt.indent=true
	wrt.standalone=true
	rdr.contentHandler = wrt
	rdr.parseURL(path)
	}

//Calls the parser function to load the xml text and then creates an XML Document Object to which it then attributes the XML text.  Finally the root element of the XML is loaded into a global variable

function loadXML(path)
	{
	parser(path)
	//Instantiate XML Object
	xml = new ActiveXObject("MSXML2.DomDocument.3.0");
	xml.async = false;
	xmlfilepath=path
	xml.loadXML(wrt.output)
	xmlroot = xml.documentElement;
	}

//This function is called by the webpage to load the XML document, not used by Labview

function loadXMLDisplay()
	{
	//Instantiate XML Object
	xml = new ActiveXObject("MSXML2.DomDocument.3.0");
	xml.async = false;
	xml.load(xmlremotelocation)
	xmlfilepath=xmlremotelocation;
	xmlroot = xml.documentElement;
	}

//Adds the passed arguments (from Labview) to the XML document by creating a new USER element with the passed arguments as attributes.  This new element is appended to the root XML element and the document is saved by calling the saveXML function

function addUser()
	{
	user = xml.createElement("USER")
	user.setAttribute("NAME", document.getElementById('name').value)
	user.setAttribute("ORDER", document.getElementById('order').value)
	user.setAttribute("CONTRACTS", document.getElementById('contracts').value)
	user.setAttribute("DATA", document.getElementById('data').value)
	user.setAttribute("ACCESSORIES", document.getElementById('accessories').value)
	user.setAttribute("PHONES", document.getElementById('phones').value)
	user.setAttribute("DATE" , dateoutput())
	user.setAttribute("NEWLINES", innernulloutput('nlineinput'))
	user.setAttribute("CPE", innernulloutput('nlinecpeinput'))
	user.setAttribute("VZA", innernulloutput('vzaccessinput'))
	user.setAttribute("VZE", innernulloutput('vzemailinput'))
	user.setAttribute("INDEX", dataindex())
	xmlroot.appendChild(user)
	saveXML()
	}

//Saves any changes made to the XML

function saveXML()
	{
	xml.save(xmlfilepath);
	xml = '';
	}

//Called by the webpage this function loads the XSL (extensible stylesheet language) and uses this code to transform the XML into an HTML output.  This output is then passed to the UsersInfo div via innerHTML

function transform()
{
	//Instantiate XSL Object
  	var xsl = new ActiveXObject("MSXML2.FreeThreadedDomDocument.3.0");
  	xsl.async = false;
  	xsl.load('users.xsl');

				
        var cache = new ActiveXObject("Msxml2.XSLTemplate.3.0");
        cache.stylesheet = xsl;
	processor=cache.createProcessor();
	processor.input = xml
	//window.alert(document.getElementById('name').value);
	processor.addParameter("selectname", document.getElementById('name').value);
	processor.addParameter("contractstotal", sumcol("CONTRACTS", document.getElementById('name').value));
	processor.addParameter("datatotal", sumcol("DATA", document.getElementById('name').value));
	processor.addParameter("accessoriestotal", sumcol("ACCESSORIES", document.getElementById('name').value));
	processor.addParameter("phonestotal", sumcol("PHONES", document.getElementById('name').value));
	processor.transform();
	UsersInfo.innerHTML=processor.output;
}

//dateoutput takes no arguments collects the current day year an month numerically and then returns the value as a single string in the order of full year month and date. Utilized datelessthenten to create a 2 digit number for day and month.

function dateoutput()
{
	var d=new Date();
	//window.alert(d.getFullYear() + datelessthenten(d.getMonth()) + datelessthenten(d.getDate()));
	return(d.getFullYear() +''+ datelessthenten(d.getMonth() + 1) +''+ datelessthenten(d.getDate()));
}

//datelessthenten takes a date object and then using the parseInt to create an integer value for the date object and concatenating with a leading 0 if the date is less then 10.

function datelessthenten(dateobj)
{
	var dateint;
	dateint = parseInt(dateobj);
	if (dateint < 10)
	{
		return ("0"+dateobj);
	}
	//window.alert(dateobj);
	return (dateobj);
}

//Clear Cells is a aggregator function for the clear function to clear any data input cells that are not created dynamically

function clearcells()
{
	Clear('order');
	Clear('contracts');
	Clear('data');
	Clear('accessories');
	Clear('phones');
}

//innernulloutput takes an DOM id as an argument and tests to see if a dynamic cell exists and the returns the value of the cell if it exists or returns the value 0 if it does not exist

function innernulloutput(idname)
{
	if(document.getElementById(idname))
	{
		return(document.getElementById(idname).value);
	}
	else
	{
		return('0');
	}
}

//innernullvalidate takes a DOM id as an argument and tests to see if the cell exists if it does then it tests against the Validate function to see if the data in the input cell is valid.

function innernullvalidate(idname)
{
	if(document.getElementById(idname))
	{
		Validate(1, 0, idname);
	}
	else
	{	
		document.getElementById(idname +"Put").innerHTML="";
	}
}

//ispagevalid takes no arguments and returns a bool result, it acts as an aggregator function to test all fields available in the form and then returns a true if all error div tags exist with '' data.

function ispagevalid()
{
	if(document.getElementById('namePut').innerHTML == "" && document.getElementById('orderPut').innerHTML == "" && document.getElementById('contractsPut').innerHTML == "" && document.getElementById('dataPut').innerHTML == "" && document.getElementById('accessoriesPut').innerHTML == "" && document.getElementById('phonesPut').innerHTML == "" && document.getElementById('nlineinputPut').innerHTML == "" && document.getElementById('nlinecpeinputPut').innerHTML == "" && document.getElementById('vzemailinputPut').innerHTML == "")
	{
		return true;
	}
	else
	{
		return false;
	}	
}

//entryvalidator takes no arguments and does not return a value. This function acts as an aggregator function that forces all validators to be run on all available cells and then tests against the ispagevalid for all error divs. if valid the function loads the xml file and redisplays the transformation submits the data to the xml processor refreshes the page and clears all non dymanic cells.
	
function entryvalidator()
{
	Validate(1, 0, 'name');
	Validate(0, 0, 'order');
	Validate(1, 0, 'contracts');
	Validate(1, 0, 'data');
	Validate(1, 0, 'accessories');
	Validate(1, 0, 'phones');
	innernullvalidate('vzaccessinput');
	innernullvalidate('vzemailinput');
	innernullvalidate('nlineinput');
	innernullvalidate('nlinecpeinput');
	if(ispagevalid())
	{
		loadXMLDisplay();transform();addUser();history.go();clearcells();
	}
}

//extractdate is a blind function It will convert a 8 digit string in the format of Full year Month and date 20081117

function extractdate(datestring, element)
{
	var month, day, year;
	if (element == 'year')
	{
		year = parseInt(datestring.substring(0,4));
		return(year);
	}else if (element == 'month')
	{
		month = parseInt(datestring.substring(4,6));
		return(month);
	}else if (element == 'day')
	{
		day = datestring.substring(6,8);
		//window.alert(year+' '+month+' '+day);
		return(day);
	}
//window.alert(year+' '+month+' '+day);
}

//togglebuttonanme takes 3 arguments 
//cboxname is the button name or checkbox name
//on is the text value of the on status of the button
//off is the text of the off status of the button.
//this function does not make any cells show or hide. it just handles the button change interaction it must be combined with the togglevisible funcion

function togglebuttonname(cboxname, on, off)
{
	if(document.getElementById(cboxname).value==off)
	{
		document.getElementById(cboxname).value=on;
	}else if(document.getElementById(cboxname).value==on)
	{
		document.getElementById(cboxname).value=off;
	}
}

//togglevisible takes 4 arguments
// cboxname is the DOM id of te button or checkbox used in toggleing values
//idname is the DOM id of the field whos visibility is to be toggled
//on is the onvalue of the cboxname button
//off is the off value of the cboxname button
//this function is no longer used in this application but left in in case additional events need to be kept in hidden fields

function togglevisible(cboxname, idname, on, off)
{
	if(document.getElementById(cboxname).value==off)
	{
		document.getElementById(idname).style.visibility="hidden";
	}else if(document.getElementById(cboxname).value==on)
	{
		document.getElementById(idname).style.visibility="visible";
	}
}

//togglefordata takes no arguments
// this function is an aggregator function that uses innertoggle to display to rows of headers and input buttons by modifying the innhtml of multiple div tags within a table with static location

function togglefordata()
{
	toggleinner('vzaccessemailcheck', 'vzaccessinputdata', 'VZA/VZE', 'Hide', '<input id="vzaccessinput" onblur="Validate(1, 0, \'vzaccessinput\');" size="10" type="text" value="0">');
	toggleinner('vzaccessemailcheck', 'vzemailinputdata', 'VZA/VZE', 'Hide', '<input id="vzemailinput" onblur="Validate(1, 0, \'vzemailinput\');" size="10" type="text" value="0">');
	toggleinner('vzaccessemailcheck', 'secondlevel4', 'VZA/VZE', 'Hide', 'Vzaccess');
	toggleinner('vzaccessemailcheck', 'secondlevel5', 'VZA/VZE', 'Hide', 'VzEmail');
	toggleinner('vzaccessemailcheck', 'vzaccessinputPut', 'VZA/VZE', 'Hide', '');
	toggleinner('vzaccessemailcheck', 'vzemailinputPut', 'VZA/VZE', 'Hide', '');
	togglebuttonname('vzaccessemailcheck', 'VZA/VZE', 'Hide');
}

//togglefornewline takes no arguments
// this function is an aggregator function that uses innertoggle to display to rows of headers and input buttons by modifying the innhtml of multiple div tags within a table with static location

function togglefornewline()
{
	toggleinner('newlinecheck', 'nlineinputdata', 'New Line', 'Hide', '<input id="nlineinput" onblur="Validate(1, 0, \'nlineinput\');" size="10" type="text" value="0">');
	toggleinner('newlinecheck', 'nlinecpeinputdata', 'New Line', 'Hide', '<input id="nlinecpeinput" onblur="Validate(1, 0, \'nlinecpeinput\');" size="10" type="text" value="0">');
	toggleinner('newlinecheck', 'secondlevel2', 'New Line', 'Hide', 'New Line #');
	toggleinner('newlinecheck', 'secondlevel3', 'New Line', 'Hide', 'CPE #');
	toggleinner('newlinecheck', 'nlineinputPut', 'New Line', 'Hide', '');
	toggleinner('newlinecheck', 'nlinecpeinputPut', 'New Line', 'Hide', '');
	togglebuttonname('newlinecheck', 'New Line', 'Hide');
}

//toggle inner takes 5 arguments
//cboxname is the DOM id of a button that will be used to toggle information
//idname is the DOM id of a field that will have its innerhtml modifiied
//on is the on vallue of the check button
//off is the off value of the check button
//inner is the innerhtml to be supplied to idname when cboxname is the on value

function toggleinner(cboxname, idname, on, off, inner)
{
	if(document.getElementById(cboxname).value==off)
	{
		document.getElementById(idname).innerHTML="";
	}else if(document.getElementById(cboxname).value==on)
	{
		document.getElementById(idname).innerHTML=inner;
	}
}

//makehidden takes 1 argument
//idname is the DOM id of a object that is to have its temporary style changed to hidden
//this function is no longer used due the efficiency of the toggle inner function that replaced it

function makehidden(idname)
{
	document.getElementById(idname).style.visibility="hidden";
}

function makevisible(idname)
{
	document.getElementById(idname).style.visibility="visible";	
}


//dataindex takes one argument
//xmllength is passed by the sumcol function due to strange errors
//this function is slated to be replaced with one that completes this task more efficiently but the sumcol function calculates the and passes it to this function this then creates and integer from the value and sets the xmlindex global veriable to 1+ that integer value

function dataindex()
{
	xml = new ActiveXObject("MSXML2.DomDocument.3.0");
	xml.async = false;
	xml.load(xmlremotelocation);
	xmlfilepath=xmlremotelocation;
	xmlroot = xml.documentElement;
	if(xml.getElementsByTagName("USER").length == 0)
	{
		return(0);
	}else
	{
	return(parseInt(xml.getElementsByTagName("USER")[xml.getElementsByTagName("USER").length - 1].getAttribute("INDEX")) + 1);
	}
}

//sumcol takes 2 arguments
//colname is the attribute name of the data that needs to be accumulated
//name is the name attribute of the employee whos column is being aggregated
//currently this function is for 1 person use i have not tested ot to accumulate with * for all items in the database
//this function is also responsible for getting the xmllength value to pass to the xmlindex function

function sumcol(colname, name)
{
	xml = new ActiveXObject("MSXML2.DomDocument.3.0");
	xml.async = false;
	xml.load(xmlremotelocation);
	xmlfilepath=xmlremotelocation;
	xmlroot = xml.documentElement;
	var xmllength = xml.getElementsByTagName("USER").length;
	var colaccum=0;	
	for (var i = 0; i<xmllength; i++)
	{
		if (xml.getElementsByTagName("USER")[i].getAttribute("NAME") == name)
		{
			colaccum = colaccum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute(colname));
		}
	}
	return(colaccum);
}

//clear takes 1 argument
//name is the DOM id of a input cell whose value needs to be reset.
//this function can be used by itself but is a small portion of the clearcells function.

function Clear(name)
{
document.getElementById(name).value="";
}

	//Input Validator
function Validate(notEmpty, typeToValidate, Element)
{
	var stor1, Filled;
	stor1 = document.getElementById(Element);
	stor2 = stor1.value.toString();
	if(notEmpty == 1)
	{
		if(stor1.value == '')
		{
		document.getElementById(Element+"Put").innerHTML ="Empty!";
		}else if(stor1.value != '')
		{
			if (typeToValidate == 0)
			{
			document.getElementById(Element+"Put").innerHTML = "";
			}else if (typeToValidate == 'ZIP')
			{
				if (stor2.length < 5)
				{
					document.getElementById(Element+"Put").innerHTML = "Zip Code Too Short";
				}
			}else if (typeToValidate == 'EMAIL')
			{
				var emailregularexpression = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/;
				var matchemail = stor2.search(emailregularexpression);
				if(matchemail != -1)
				{
					document.getElementById(Element+"Put").innerHTML ="";
				}
				else
				{
					document.getElementById(Element+"Put").innerHTML = "Not a Valid Email Address";
				}
				
			}else if(typeToValidate == 'PHONE')
			{
				var phoneregularexpression = /\(?\d{3}\)?([-\/\.])\d{3}\1\d{4}/;
				var matchphone = stor2.search(phoneregularexpression);
				if(matchphone != -1)
				{
					document.getElementById(Element+"Put").innerHTML =""; 
				}
				else
				{
					document.getElementById(Element+"Put").innerHTML = "Not A Valid Phone Number Format 555-555-5555";
				}
			}
		}
	}	
}

function JSDisplayTable(name, month)
{
	xml = new ActiveXObject("MSXML2.DomDocument.3.0");
	xml.async = false;
	xml.load(xmlremotelocation);
	xmlfilepath=xmlremotelocation;
	xmlroot = xml.documentElement;
	var xmllength = xml.getElementsByTagName("USER").length;
	var innerstring;
	var datasum= 0, accessoriessum= 0, phonessum = 0, contractsum = 0;
	if (name == 'All')
	{
		makehidden('topheader');
		makehidden('entrybutton');
		makehidden('order');
		makehidden('contracts');
		makehidden('data');
		makehidden('accessories');
		makehidden('phones');
		makehidden('newlinecheck');
		makehidden('vzaccessemailcheck');
		innerstring = '<table border="1" bgcolor="white" width="100%"><tr><th>Name</th><th>Order #</th><th>Contracts #</th><th>Data $</th><th>Accessories #</th><th>Phones #</th><th>Date</th></tr>';
		for(var i = xmllength - 1; i>=0; i--)
		{	
			if (month == 'All')
			{
			innerstring = innerstring + '<tr>';
			innerstring = innerstring + '<td>' + xml.getElementsByTagName("USER")[i].getAttribute("NAME") +'</td>';
			innerstring = innerstring + '<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ORDER") +'</td>';
			innerstring = innerstring + '<td>' + xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS") +'</td>';
			innerstring = innerstring + '<td>' + xml.getElementsByTagName("USER")[i].getAttribute("DATA") +'</td>';
			innerstring = innerstring + '<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES") +'</td>';
			innerstring = innerstring + '<td>' + xml.getElementsByTagName("USER")[i].getAttribute("PHONES") +'</td>';
			//innerstring = innerstring + '<td>' + xml.getElementsByTagName("USER")[i].getAttribute("INDEX")
			//innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("INDEX") +'</td>';
			innerstring = innerstring + '<td>' + extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'month') +'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'day')+'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'year')+'</td>';
			innerstring = innerstring +'</tr>';
			datasum = datasum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("DATA"));
			accessoriessum = accessoriessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES"));
			phonessum = phonessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("PHONES"));
			contractsum = contractsum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS"));
			}else
			if (extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'month') == document.getElementById('monthfilter').value)
				{
					innerstring = innerstring +'<tr>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("NAME") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ORDER") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("DATA") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("PHONES") +'</td>';
					//innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("INDEX") +'</td>';
					innerstring = innerstring + '<td>' + extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'month') +'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'day')+'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'year')+'</td>';
					innerstring = innerstring +'</tr>';
					datasum = datasum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("DATA"));
					accessoriessum = accessoriessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES"));
					phonessum = phonessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("PHONES"));
					contractsum = contractsum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS"));
				}
		}
		innerstring = innerstring +'<tr><td></td><td>Totals</td><td>'+contractsum+'</td><td>'+datasum+'</td><td>'+accessoriessum+'</td><td>'+phonessum+'</td></td>';
		innerstring = innerstring +'<tr><td></td><td>DAPC</td><td>$'+ roundNumber(datasum / contractsum, 2) +'</td><td>ATR</td><td>'+ roundNumber(accessoriessum/phonessum, 2) +'</td></tr>';
		innerstring = innerstring +'</table>';
		document.getElementById('jsinfo').innerHTML = innerstring;
	}else
	{
		makevisible('topheader');
		makevisible('entrybutton');
		makevisible('order');
		makevisible('contracts');
		makevisible('data');
		makevisible('accessories');
		makevisible('phones');
		makevisible('newlinecheck');
		makevisible('vzaccessemailcheck');
		innerstring = '<table border="1" bgcolor="white" width="100%"><tr><th>Name</th><th>Order #</th><th>Contracts #</th><th>Data $</th><th>Accessories #</th><th>Phones #</th><th>Date</th><th>Delete</th></tr>';
		for(var i = xmllength - 1; i>=0; i--)
		{
			if (month == 'All')
			{
				if (xml.getElementsByTagName("USER")[i].getAttribute("NAME") == name)
				{	
					innerstring = innerstring +'<tr>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("NAME") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ORDER") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("DATA") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES") +'</td>';
					innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("PHONES") +'</td>';
					innerstring = innerstring + '<td>' + extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'month') +'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'day')+'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'year')+'</td>';
					innerstring = innerstring +'<td><a href=# onclick="removeByIndex(\'' + xml.getElementsByTagName("USER")[i].getAttribute("INDEX") +'\');">Delete</a></td>';
					innerstring = innerstring +'</tr>';
					datasum = datasum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("DATA"));
					accessoriessum = accessoriessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES"));
					phonessum = phonessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("PHONES"));
					contractsum = contractsum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS"));
				}
			}else
			{
				if (extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'month') == document.getElementById('monthfilter').value)
				{
					if (xml.getElementsByTagName("USER")[i].getAttribute("NAME") == name)
					{	
						innerstring = innerstring +'<tr>';
						innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("NAME") +'</td>';
						innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ORDER") +'</td>';
						innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS") +'</td>';
						innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("DATA") +'</td>';
						innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES") +'</td>';
						innerstring = innerstring +'<td>' + xml.getElementsByTagName("USER")[i].getAttribute("PHONES") +'</td>';
						innerstring = innerstring + '<td>' + extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'month') +'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'day')+'/'+extractdate(xml.getElementsByTagName("USER")[i].getAttribute("DATE"), 'year')+'</td>';
						innerstring = innerstring +'<td><a href=# onclick="removeByIndex(\'' + xml.getElementsByTagName("USER")[i].getAttribute("INDEX") +'\');">Delete</a></td>';
						innerstring = innerstring +'</tr>';
						datasum = datasum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("DATA"));
						accessoriessum = accessoriessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("ACCESSORIES"));
						phonessum = phonessum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("PHONES"));
						contractsum = contractsum + parseInt(xml.getElementsByTagName("USER")[i].getAttribute("CONTRACTS"));
					}
				}
			}
		}
		innerstring = innerstring +'<tr><td></td><td>Totals</td><td>'+contractsum+'</td><td>'+datasum+'</td><td>'+accessoriessum+'</td><td>'+phonessum+'</td></td>';
		innerstring = innerstring +'<tr><td></td><td>DAPC</td><td>$'+ roundNumber(datasum / contractsum, 2) +'</td><td>ATR</td><td>'+ roundNumber(accessoriessum / phonessum, 2) +'</td></tr>';
		innerstring = innerstring +'</table>';
		document.getElementById('jsinfo').innerHTML = innerstring;
	}
}

function removeByIndex(index)
{

	xml = new ActiveXObject("MSXML2.DomDocument.3.0");
	xml.async = false;
	xml.load(xmlremotelocation);
	xmlfilepath=xmlremotelocation;
	xmlroot = xml.documentElement;
	var xmllength = xml.getElementsByTagName("USER").length;
	for(var i = 0; i<xmllength; i++)
	{
		if (xml.getElementsByTagName("USER")[i].getAttribute("INDEX") == index)
		{
			xml.documentElement.removeChild(xml.getElementsByTagName("USER")[i]);
			saveXML();
			JSDisplayTable(document.getElementById('name').value, document.getElementById('monthfilter').value);
			return(null);
		}
	}
	JSDisplayTable(document.getElementById('name').value, document.getElementById('monthfilter').value);	
}

function JSDisplayFilter()
{
	
	
	JSDisplayTable(document.getElementById('name').value);
}

function setCurrentMonth()
{
	var d=new Date();
	document.getElementById('monthfilter').value = datelessthenten(d.getMonth() + 1);	
}

function roundNumber(num, dec) 
{
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}