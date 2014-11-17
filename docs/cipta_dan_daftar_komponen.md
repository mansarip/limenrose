## CIPTA & DAFTAR KOMPONEN
#### PROPERTIES.JSON

`default` (object)
> Value yang ditetapkan pada asalnya untuk sesuatu component. Terdapat beberapa jenis default value yang boleh ditetapkan :

- **==Auto==** (string)
	Perkataan "auto" digunakan untuk membenarkan application generate value bagi property tersebut. Hanya properties key tertentu sahaja yang dibenarkan menggunakan auto. Jika property key yang digunakan tidak termasuk dalam senarai auto, value yang akan dipulangkan adalah empty string `""`.

	Senarai properties key yang boleh menggunakan auto :
	| Key | Description |
	|--------|--------|
	| type   | value diambil dari key "name" dalam file register.json |
    | name   | value diambil dari running number mengikut jenis component |
    | connection   | value diambil dari senarai connection |
    
    Contoh :
	```
    "default" : {
	    "type" : "auto",
		"name" : "auto",
		"connection" : "auto"
    }
    ```

- **==Direct==** (number, string, bool)
	Ambil value seperti apa yang ditetapkan.

    Contoh :
	```
    "default" : {
	    "sqlquery" : "select * from table"
    }
	```
    
---
_ _ _

`propertiesForm` (object)
> Memegang object yang akan ditukar menjadi label dan input. Digunakan untuk mebina properties form bagi sesuatu component. Senarai element (input) yang dibenarkan adalah seperti berikut :

- **==Input Text==** ("inputtext")
- **==Text Area==** ("textarea")
- **==Select Dropdown==** ("dropdown")
- **==Checbox==** ("checkbox")

#### TEMPLATE.PHP

File template.php adalah file yang menentukan rupa bentuk akhir setiap component. File ini akan disertakan (include) semasa viewer dijalankan, bermakna terdapat beberapa variable yang boleh digunakan :

`$lnr_prop` (array)
> Memegang butiran component.

`$lnr_conn` (resource)
> Memegang connection object berdasarkan property connection (jika ada).

`$lnr_result` (array)
> Hasil execution query (jika ada)