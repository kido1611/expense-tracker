# Expense Tracker

Lacak pengeluaran per bulan per dompet

## Syarat

### Common

- [x] Bisa banyak pengguna.
- [x] 1 pengguna punya banyak dompet.
- [x] 1 dompet bisa punya banyak transaksi.
- [x] Transaksi harus ada dompet.
- [x] Transaksi bisa dalam bentuk pengeluaran atau pendapatan.
- [ ] Tiap transaksi bisa tambah catatan (Markdown).
- [x] Tiap transaksi bisa tambah foto.
- [x] Transaksi harus ada kategori.
- [x] Bisa transfer antar dompet.
- [x] Bisa adjust balance dompet (langsung tulis nilai akhir).
- [x] Transaksi bisa masuk atau tidak diperhitungan laporan.
- [x] Transfer antar dompet bisa ada biaya transfer (transaksi).
      Biaya transfer masuk dalam kategori tertentu.
- [x] Transfer antar dompet tidak masuk ke dalam laporan.
- [ ] Ada laporan per bulan
- [ ] laporan dihitung jika transaksi ditampilkan di laporan
- [ ] Ada budgeting
- [ ] Ada pilihan budgeting di transaction form.
- [ ] ~~Budgeting dibuat berdasarkan kategori. Bisa berisi minimal 1 kategori.~~
- [ ] Add server middleware to check is user exist
- [x] custom wallet icon
- [ ] custom category icon
- [x] tambah kolom real_amount di transactions (simpan dengan nilai +/-
      berdasarkan category)
- [ ] route/command untuk recalculate wallet balance
- [x] tambah badge untuk menandai transaksi adalah transfer bank
- [ ] add photo in wallet-transfer

### Pro features

- [ ] Dompet bisa diatur banyak orang.

## Bahan Pertimbangan

- Frontend Official, Backend Official
- Frontend Official, Backend SelfHosted
- Frontend SelfHosted, Backend SelfHosted

## Catatan

- harus URL safe. Dompet dan Transaksi menggunakan nanoid, kategori menggunakan slug.
- Harus ada default kategori (pre-seeding)
  - Pendapatan:
    - Gaji
  - Pengeluaran:
    - Biaya transfer

## Tabel

### users

```
id        : bigint    [PK]
nanoid    : string   index
```

### wallets

### wallet_transfers

### transactions
