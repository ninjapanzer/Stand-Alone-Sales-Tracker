Stand Alone Serverless Sales Tracker V1.29

The purpose of this system is to allow an intranet connected office to track and report sales figures in a single location without the need for a server to host the files. All that is needed is a network shared folder and IE.

This tracker runs completely from JS and Internet Explorer. IE is required due to the useage of the Microsoft's HyperText Application Model. This opens IE in a manner that doesn't enforce JS security allowing for the editing of files locally and remotely. The best deployment of this system is to create a shortcut to usermod.hta and adjusting the first global in xml.JS 
var xmlremotelocation="users.xml" to the network location ie. var xmlremotelocation="\\myserver\tracker\users.xml"
And change the script location within usermod.hta use any text editor to change the line <script src="xml.js"></script> to the appropriate location of the file on your network. This is necessary because even though you are loading an html file that exists remotely the content is treated as local so a link to your .hta file makes the browser look local to its cache for the JS resource instead of accross your network. The same is the case with the JS once it has been loaded.

Verison History:
0.09 Allowed for Interface
0.14 Could Write to XML file remotely
0.20 Converted to .hta for ease of use in intranet enviroment
0.50 Build XML Schema for quicker reporting
0.55 added view all
0.62 built aggregation into XML
0.75 added delete function
0.88 Refined interface
0.90 added entry validators
1.00 general release version with branding
1.20 created remote deployable version
1.29 de-branded and released under Open Source

TODO:
Create customizable report system
Add a selection for year
build customizeable XML Schema
Reorganize xml.js and add documentation

The majority of this code was built from scratch by me:
Paul Scarrone
paul.scarrone@gmail.com

But some code was adapted from:

Calling External Javascript V1.0.0
Copyright © 2006, Randy Recob
All rights reserved.

Author:
Randy Recob
randyrecob@sbcglobal.net

Distribution:
This code was downloaded from the LAVA Code Repository: http://forums.lavag.org/downloads.html


Description::
An example of utilizing external javascript in Labview.

In this example an external javascript is loaded into Labview and it's functions are called to modify an existing XML database/file by adding information passed to the javascript function from Labview.

Included in this zip file are the following:
CallingJavascript.vi - Example vi
users.xml - XML database file
users.xsl - Extensible Structure Language for converting XML to HTML
users.htm - Webpage for displaying database contents
xml.js - External javascript called by Labview and users.htm

Version History:
1.0.0: Initial release of the code.

License:
Creative Commons Attribution 2.5 License