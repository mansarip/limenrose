Lime & Rose
===========

Lime &amp; Rose Reporting Tool dibina menggunakan PHP.

#### Requirement
- Webserver + PHP

#### Best Server Settings
- Tutup warning & notice message

#### Error Code
```
LNR-ERR000 : Report not specified
LNR-ERR001 : Empty report name
LNR-ERR002 : Report not found
LNR-ERR003 : Invalid report file [ corrupted source ]
LNR-ERR010 : MySQL Connect Error (1045) Access denied
```

#### Report Designer
##### Publish
Pengguna boleh terus publish report melalui report designer. Satu file akan dihasilkan dalam folder `publish/<%project%>`. File tersebut dihasilkan dalam bentuk binary.

#### Development Logs
````
19/11/2014
File enrypt.php dihasilkan untuk convert surat.lnr kepada surat.lnre - Luqman

02/12/2014
Masukkan error mysql ke dalam DisplayError function. - Luqman
````
