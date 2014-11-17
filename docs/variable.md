## SYSTEM VARIABLE

Senarai pemboleh ubah (variable) yang telah ditetapkan dalam LNR :

`REPORT_NAME`
`REPORT_AUTHOR`
`REPORT_DESCRIPTION`
`DATE:d m y` : Format adalah sama seperti PHP date
`PAGE_NUMBER`
`TOTAL_PAGE`

Cara menggunakan atau memanggil sytem variable :
`{LNR|<%sys_var_name%>}`

contoh :
>Tarikh Cetak : `{LNR|REPORT_AUTHOR}`
>Tarikh Cetak : Luqman B Shariffudin

## PHP VARIABLE

Digunakan untuk memanggil POST, GET atau SESSION variable.

`POST`
`GET`
`SESSION`

Cara menggunakan atau memanggil php variable :
`{<%sys_var_type%>|<%sys_var_name%>}`

contoh :
>{POST|username}
>{GET|agenid}
>{SESSION|login}

## QUERY RESULT VARIABLE

Digunakan untuk memanggil value yang didapati melalui hasil execution query.

Cara menggunakan atau memanggil php variable :
`{COLUMN|<%sys_column_name%>}`

contoh :
>{COLUMN|username}