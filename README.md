Lime & Rose
===========

Lime &amp; Rose Reporting Tool dibina menggunakan PHP.

#### Requirement
- Webserver + PHP

#### Best Server Settings
- Tutup warning & notice message

#### Report Designer
###### Publish
Pengguna boleh terus publish report melalui report designer. Satu file akan dihasilkan dalam folder `publish/<%project%>`. File tersebut dihasilkan dalam bentuk binary.

###### Query & Group Mapping
Setiap query akan menghasilkan satu dataset iaitu hasil execution query tersebut. Dalam satu report, boleh ada banyak query tetapi masih menggunakan satu connection yang sama. Setiap group mesti ada satu dataset. Dalam satu report mesti ada paling kurang 1 group yang dipanggil "master". Group master ini memang ada secara default dan ia merujuk kepada report itu sendiri.

###### Parameter
Sumber parameter boleh datang dari POST, GET, SESSION.

#### Error Code
```
LNR-ERR000 : Report not specified
LNR-ERR001 : Empty report name
LNR-ERR002 : Report not found
LNR-ERR003 : Invalid report file [ corrupted source ]
LNR-ERR010 : MySQL Connect Error (1045) Access denied
```

#### Rules
1. Satu report satu dataset (sql).
2. Nama parameter tidak boleh ada space, hanya karakter a-z, A-Z, 0-9 sahaja dibenarkan.


#### Development Logs
````
19/11/2014
File enrypt.php dihasilkan untuk convert surat.lnr kepada surat.lnre - Luqman

02/12/2014
Masukkan error mysql ke dalam DisplayError function. - Luqman

05/01/2015
Tukar encryption cipher kepada "MCRYPT_BLOWFISH" (ada error berlaku lepas update php ke 5.6) - Luqman
````

#### Testing
1. Report kosong, tanpa connection, tanpa layout [X]
2. Report tanpa connection, tapi ada layout [X]