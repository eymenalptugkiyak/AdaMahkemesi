 # ADA MAHKEMESI HESAPLAYICI (ISLAND COURT CALCULATOR)

 ## Proje Hakkında

Bu projeyi, "Ada Mahkemesi" adlı case study için geliştirdim. Senaryoda 5 farklı hakim, belirsiz sayıda jüri ve değişken rüşvet/ikna maliyetleri bulunuyor. Olay anında tüm parametreler değişebildiği için, manuel hesaplama yapmak yerine en düşük maliyetli kurtuluş yolunu bulan bir Rüşvet Sistemi  tasarladım.

 ## Amacımız
Haksız yere suçlanan biri sistemin açığından yararlanıp nasıl bu durumdan en ucuz şekilde kurtulabilir işte bunu tek tıkla çözmek. Tabi o rüşvet bedelini ödedikleri sürece.

## Kurduğum Algoritma Mantığı

Uygulamanın kalbinde çalışan algoritmayı şu mantık üzerine kurguladım:

Önce Sabitleri Belirle: Jüri sayısı girildiği an; Tam jüri maliyeti, salt çoğunluk sayısı ve buna göre olan "Jüri maliyeti" hesaplanıp hafızaya alınır. Ayrıca kullanıcıdan aldığımız Hakimlerin "Beraat" ücretleri ve "Çekimserlik" ücretleri de hafızaya alınır. 

Tüm İhtimalleri Hesapla : Algoritma 5 hakimi tek tek seçer ve her biri için şu soruyu sorar:

1. Yol: Bu hakime direkt beraat rüşveti verirsem ne kadar tutar?

2. Yol: Bu hakimi sadece çekimser kalması için rüşvet versem, kalan işi jüriyle çözersem  ne kadar tutar?

Karar Ver : Hakimlerden bağımsız "Sadece Jüri" seçeneği de dahil olmak üzere toplam 11 sonuç bir havuza atılır. Array.sort() ile en düşük maliyetten en yükseğe sıralanır ve en mantıklı seçenek "En ucuz yol" olarak sunulur.
