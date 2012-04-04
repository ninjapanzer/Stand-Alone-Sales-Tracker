<?xml version="1.0"?>
<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        version="1.0">
<xsl:output method="html"/>
<xsl:variable name="contractaccum" select="0"/>
<xsl:param name="selectname"/>
<xsl:param name="contractstotal"/>
<xsl:param name="datatotal"/>
<xsl:param name="accessoriestotal"/>
<xsl:param name="phonestotal"/>
<xsl:template match="/">
<div>
<table border="1" bgcolor="white" width="100%"><tr><th>Name</th><th>Order #</th><th>Contracts #</th><th>Data $</th><th>Accessories #</th><th>Phones #</th><th>Remove</th></tr>
<xsl:for-each select="//USER[@NAME=$selectname]">
<tr align="center">
<td><xsl:value-of select="@NAME"/></td>
<td><xsl:value-of select="@ORDER"/></td>
<td><xsl:value-of select="@CONTRACTS"/></td>
<td><xsl:value-of select="@DATA"/></td>
<td><xsl:value-of select="@ACCESSORIES"/></td>
<td><xsl:value-of select="@PHONES"/></td>
<td><xsl:value-of select="@INDEX"/><a href="#" onclick="window.alert('');">test</a></td>
</tr>
</xsl:for-each>
<tr align="center">
<td></td>
<td>Totals</td>
<td><xsl:value-of select="$contractstotal"/></td>
<td><xsl:value-of select="$datatotal"/></td>
<td><xsl:value-of select="$accessoriestotal"/></td>
<td><xsl:value-of select="$phonestotal"/></td>
</tr>
<tr align="center">
<td></td>
<td>Averages</td>
<td><xsl:value-of select="$datatotal div $contractstotal"/></td>
<td><xsl:value-of select="$accessoriestotal div $contractstotal"/></td>
</tr>
</table>
</div>
</xsl:template>
</xsl:stylesheet>