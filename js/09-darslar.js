/* Darslar: Xogvarts fanlari - har biri kichik interaktiv mashg'ulot (Afsunlar, Damlamalar...), kuniga bir marta ball
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Egasi (2026-10-07): Xogvarts bosh sahifasida "Kunlik savol" o'rnida "Darslar". Asardagi fanlar;
     kunlik savol "Sehrgarlik tarixi" ichida. Holat va ball botda (hpdars.py, POST /api/dars).
     Bugungi mavzu (qaysi afsun, qaysi damlama) serverdan keladi - hammaga bir xil.
     Qoida (egasi, 2026-10-07 kechqurun): har fanda 24 ta DARS - mashq, ballsiz va cheklovsiz (fan sahifasidagi to'r);
     ball faqat kunlik BELLASHUVDAN. Yangi fan: DR_FANLAR da `on: true`, o'yin ekrani, fanLevel va blStart da tarmoq, botda hpdars.DARSLAR. */
  var API_DARS = "https://bot.tizimshunos.uz/api/dars";
  var DR_FANLAR = [
    { id: "tarix", on: true, rgb: "232,132,60",
      nom: { uz: "Sehrgarlik tarixi", ru: "История магии", en: "History of Magic" },
      ust: { uz: "Professor Binns", ru: "Профессор Бинс", en: "Professor Binns" },
      izoh: { uz: "Sehrgarlar olami haqida savollarga javob bering.", ru: "Отвечайте на вопросы о мире волшебников.", en: "Answer questions about the wizarding world." } },
    { id: "afsun", on: true, rgb: "120,170,240",
      nom: { uz: "Afsunlar", ru: "Заклинания", en: "Charms" },
      ust: { uz: "Professor Flitvik", ru: "Профессор Флитвик", en: "Professor Flitwick" },
      izoh: { uz: "Tayoqcha harakatini barmog'ingiz bilan chizing.", ru: "Нарисуйте пальцем движение палочки.", en: "Trace the wand movement with your finger." } },
    { id: "iksir", on: true, rgb: "110,190,130",
      nom: { uz: "Damlamalar", ru: "Зельеварение", en: "Potions" },
      ust: { uz: "Professor Sneyp", ru: "Профессор Снегг", en: "Professor Snape" },
      izoh: { uz: "Retseptni eslab qoling va damlamani tartib bilan tayyorlang.", ru: "Запомните рецепт и сварите зелье по порядку.", en: "Memorise the recipe and brew the potion in order." } },
    { id: "trans", on: true, rgb: "200,150,90",
      nom: { uz: "Transfiguratsiya", ru: "Трансфигурация", en: "Transfiguration" },
      ust: { uz: "Professor Makgonagall", ru: "Профессор Макгонагалл", en: "Professor McGonagall" },
      izoh: { uz: "Afsun qoidasini toping va u keyingi buyumni nimaga aylantirishini ayting.", ru: "Найдите правило заклинания и скажите, во что оно превратит следующий предмет.", en: "Work out the spell's rule and say what it will do to the next object." } },
    { id: "himoya", on: true, rgb: "190,110,110",
      nom: { uz: "Qora kuchlardan himoya", ru: "Защита от Тёмных искусств", en: "Defence Against the Dark Arts" },
      ust: { uz: "Professor Lyupin", ru: "Профессор Люпин", en: "Professor Lupin" },
      izoh: { uz: "Xavf yetib kelguncha to'g'ri himoya afsunini tanlang.", ru: "Выберите верное защитное заклинание, пока опасность не настигла.", en: "Pick the right defensive spell before the danger reaches you." } },
    { id: "osimlik", on: true, rgb: "140,180,90",
      nom: { uz: "O'simlikshunoslik", ru: "Травология", en: "Herbology" },
      ust: { uz: "Professor Sprout", ru: "Профессор Стебль", en: "Professor Sprout" },
      izoh: { uz: "Issiqxonadagi o'simliklarga o'z vaqtida kerakli parvarishni bering.", ru: "Вовремя давайте растениям в теплице нужный уход.", en: "Give every greenhouse plant the care it needs, in time." } },
    { id: "astro", on: true, rgb: "130,130,220",
      nom: { uz: "Astronomiya", ru: "Астрономия", en: "Astronomy" },
      ust: { uz: "Professor Sinistra", ru: "Профессор Синистра", en: "Professor Sinistra" },
      izoh: { uz: "Burilgan turkumni boshqa shakllar orasidan tanib oling.", ru: "Узнайте повёрнутое созвездие среди других фигур.", en: "Spot the turned constellation among other shapes." } },
    { id: "uchish", on: true, rgb: "224,178,91",
      nom: { uz: "Uchish darsi", ru: "Полёты на мётлах", en: "Flying" },
      ust: { uz: "Xuch xonim", ru: "Мадам Трюк", en: "Madam Hooch" },
      izoh: { uz: "Supurgini barmog'ingiz bilan boshqarib, halqalardan o'ting.", ru: "Управляйте метлой пальцем и пролетайте сквозь кольца.", en: "Steer the broom with your finger and fly through the hoops." } },
    { id: "maxluq", on: true, rgb: "170,140,110",
      nom: { uz: "Sehrli maxluqlar parvarishi", ru: "Уход за магическими существами", en: "Care of Magical Creatures" },
      ust: { uz: "Xagrid", ru: "Хагрид", en: "Hagrid" },
      izoh: { uz: "Har bir maxluqni o'z yemishi bilan juftlang.", ru: "Найдите каждому существу его корм.", en: "Match every creature with its food." } }
  ];
  var DR_TX = {
    uz: { kick: "Xogvarts", ttl: "Darslar", tile: "Darslar", tileNew: function (n) { return "Bugun " + n + " ta topshiriq kutmoqda"; }, tileDone: "Darslar va bellashuv",
          sum: function (a, b) { return a + " / " + b + " dars o'tilgan"; }, note: "Darslar — mashq, xohlagancha o'ting. Ball «Bellashuv» bo'limida beriladi.",
          pts: function (n) { return "+" + n + " ball"; }, done: "Bajarildi", soon: "Tez orada", go: "Darsga kirish", again: "Mashq qilish",
          of: function (a, b) { return a + " / " + b + " dars"; }, lessons: "Darslar", lessonsS: "Mashq: ball berilmaydi, xohlagancha o'ting. Ball — «Bellashuv» bo'limida.",
          blTile: "Bellashuv", blTileNew: function (n) { return "Bugun " + n + " ta bellashuv kutmoqda"; }, blTileDone: "Bugun hammasida qatnashdingiz",
          blHomeS: "Ball shu yerda yig'iladi. Har kuni yangi topshiriq — hammaga bir xil; kim tezroq va xatosiz bajarsa, ertaga ball oladi.",
          chessT: "Sehrgarlar shaxmati", chessS: "Jonli raqib bilan o'ynang · g'alaba +10 ball", tileProg: function (a, b) { return a + " / " + b + " dars o'tilgan"; },
          locked: "Avval oldingi darsni o'ting", passed: function (n) { return n + "-dars o'tildi"; }, again2: "Bu dars oldin o'tilgan — mashq qildingiz.",
          next: "Keyingi dars", toList: "Darslar ro'yxati", allDone: "Hamma dars o'tilgan",
          dailyT: "Kunlik savol", dailyNew: "Bugungi savol kutmoqda", dailyDone: "Bugungi savolga javob berilgan",
          bellCard: "Bugungi bellashuv", bellIn: "Bellashuvga kirish", tarixItem: function (n) { return n + " ta savol"; },
          trQ: function (a, b) { return "Savol " + a + " / " + b; }, trRes: function (a, b) { return b + " tadan " + a + " tasi to'g'ri"; },
          trFail: function (n, j) { return n >= j ? "Keyingi darsga o'tish uchun hamma savolga to'g'ri javob berish kerak." : "Dars o'tishi uchun kamida " + n + " ta to'g'ri javob kerak."; }, retry: "Qayta urinish", loadQ: "Savollar ochilmoqda…",
          lvl: function (n) { return n + "-dars"; }, lvlDone: function (n) { return n + " ta dars o'tilgan"; },
          bell: "Bellashuv", bellS: "Ball shu yerda: kuniga bitta topshiriq — hammaga bir xil. Kim tezroq va xatosiz bajarsa, ertaga ball oladi.",
          bellOf: function (f) { return f + " bellashuvi"; }, bellNone: "Hali qatnashmadingiz", bellGo: "Boshlash", bellNo: "Bugungi urinishlar tugadi",
          tries: function (n) { return n + " ta urinish qoldi"; }, place: function (n, j) { return n + "-o'rin · " + j + " kishidan"; },
          prizes: function (a, b, c, d) { return "1-o'rin +" + a + " · 2-o'rin +" + b + " · 3-o'rin +" + c + " · 4–10-o'rin +" + d + " ball"; },
          rule: "Vaqt «Boshlash» bosilgandan hisoblanadi. Har xato +3 soniya. Eng yaxshi urinishingiz hisobga olinadi.",
          topT: "Bugungi jadval", topNone: "Hali hech kim qatnashmadi — birinchi bo'ling!", yest: "Kechagi g'oliblar",
          yestMe: function (n, p) { return "Siz kecha " + n + "-o'rin" + (p ? " · +" + p + " ball" : ""); }, sec: function (ms) { return (ms / 1000).toFixed(1) + " s"; },
          leftT: function (h, m) { return "Tugashiga " + (h ? h + " soat " : "") + m + " daqiqa qoldi"; }, ptsW: "ball", meK: "Sizning natijangiz", meBest: "Eng yaxshi natijangiz",
          you: "siz", resT: function (t) { return "Natijangiz: " + t; }, resBest: function (t) { return "Eng yaxshi natijangiz: " + t; },
          bellBack: "Jadvalga qaytish", timer: "Vaqt ketyapti",
          today: "Bugungi mavzu", back: "Darslarga qaytish", got: function (n) { return "Fakultetingizga +" + n + " ball"; },
          practice: "Bu dars bugun bajarilgan — mashq uchun ball berilmaydi.", fail: "Hozir bo'lmadi, birozdan keyin urinib ko'ring",
          // afsunlar
          afStep: function (a, b) { return a + " / " + b + "-urinish"; },
          afR: ["Chiziq bo'ylab chizing", "Chiziq xira — diqqat bilan", "Endi yoddan chizing"],
          afStart: "Yonib turgan nuqtadan boshlang", afOff: "Tayoqcha chetga chiqdi — qaytadan", afShort: "Harakatni oxirigacha chizing",
          afOk: ["Yaxshi! Yana bir marta.", "Ajoyib! Endi yoddan.", "Barakalla! Afsun o'zlashtirildi."], afShow: "Chiziqni ko'rsatish",
          afBaho: ["Troll", "Yomon", "Qoniqarli", "Kutilganidan yuqori", "A'lo"], afBahoT: "Baho", afAcc: function (p) { return "Aniqlik " + p + "%"; }, afVaqt: function (a, b) { return "Vaqtida " + a + " / " + b; },
          afLow: "Keyingi darsga o'tish uchun kamida «Qoniqarli» baho kerak.",
          afNth: function (a, b) { return a + " / " + b + "-afsun"; }, afVazT: "Qaysi afsun kerak?", afVazK: "Vaziyat", afZanK: "Ketma-ket afsunlar", afVazNo: "Bu afsun yordam bermaydi",
          afFlN: "Professor Flitvik",
          afFl: { a: ["Ajoyib, juda aniq!", "Barakalla! Bilak harakati a'lo.", "Zo'r! Xuddi darslikdagidek."],
                  b: ["Yomon emas. Bilakni yumshoqroq tuting.", "Durust, lekin chiziqdan uzoqlashmang.", "Bo'ladi. Yana bir oz diqqat!"],
                  c: ["Tezroq — sham kutib turmaydi!", "To'g'ri, lekin juda sekin."] },
          afFlB: ["Bunaqada tayoqcha ham xafa bo'ladi. Qaytadan!", "Hali mashq kerak. Yana bir urinib ko'ring.", "Qoniqarli. Mashq qilsangiz, bundan ham yaxshi chiqadi.", "Juda yaxshi! Yana ozgina — va a'lo bo'ladi.", "A'lo! Fakultetingiz siz bilan faxrlansa arziydi."], afPuf: "Afsun chiqmadi…", afKech: "sham o'chdi",
          // iksirlar
          ikRec: "Retsept", ikRecS: "Masalliqlar tartibini eslab qoling — keyin retsept yopiladi.", ikGo: "Tayyorman",
          ikCook: "Masalliqlarni tartib bilan qozonga soling", ikErr: function (a, b) { return "Xato: " + a + " / " + b; },
          ikBad: ["Noto'g'ri. Diqqat qiling!", "Yana xato. Qozon qaynab ketyapti…"], ikBoom: "Damlama buzildi. Retseptni qaytadan o'qing.",
          ikOk: "Damlama tayyor. Professor Sneyp… hech narsa demadi. Bu maqtov.",
          hmStep: function (a, b) { return a + " / " + b + "-xavf"; }, hmGo: "Boshlash", hmNew: "Yangi xavf. Qaysi afsun yordam berishini eslab qoling.",
          hmOld: "Yangi xavf yo'q. Endi ular ko'proq va tezroq keladi.", hmHint: "To'g'ri himoyani tanlang", hmOk: ["Ajoyib!", "Juda yaxshi!", "Xuddi shunday!"],
          hmBad: "Bu yordam bermaydi!", hmLate: "Kech qoldingiz!", hmLpN: "Professor Lyupin", hmStat: function (w, l) { return "Xato: " + w + " · Kechikish: " + l; },
          hmLpB: ["Hechqisi yo'q. Shokolad yeng va qaytadan urinib ko'ring.", "Hali tayyor emassiz, lekin buni o'rgansa bo'ladi. Yana bir marta.", "Qoniqarli. Xavf oldida o'zingizni yo'qotmadingiz.", "Juda yaxshi! Tezligingiz oshyapti.", "A'lo! Bunday himoyani kam ko'rganman."],
          ucStep: function (a, b) { return "Halqa " + a + " / " + b; }, ucGo: "Uchish!", ucHint: "Barmog'ingizni o'ngga-chapga suring",
          ucIntro: ["Supurgini barmog'ingiz bilan o'ngga-chapga boshqaring va oltin halqalarning o'rtasidan o'ting. Ketma-ket o'tsangiz, tezlashasiz.", "Bugun maydonda bladjerlar bor. Ularga urilmang — uchta zarbadan keyin dars tugaydi.", "Oltin Snitch ham uchib o'tadi. Tutib olsangiz, bahoyingiz oshadi.", "Supurgiga! Halqalar torayib, tezlik oshib boradi."],
          ucOk: ["Yaxshi!", "Shunday!", "Ajoyib!"], ucMiss: "Halqa o'tib ketdi!", ucHit: "Bladjer! Ehtiyot bo'ling!", ucSn: "Snitch tutildi!", ucXcN: "Xuch xonim",
          ucStat: function (a, b, z, sn) { return "Halqalar: " + a + " / " + b + " · Zarba: " + z + (sn ? " · Snitch" : ""); },
          ucXcB: ["Supurgidan tushing. Avval yerda mashq qilamiz.", "Hali erta. Halqalarga qarang, osmonga emas!", "Qoniqarli. Supurgi sizni tinglay boshladi.", "Yaxshi uchdingiz! Qo'lingiz mustahkam.", "A'lo! Sizdan zo'r izlovchi chiqadi."],
          mxStep: function (a, b) { return "Juftlik " + a + " / " + b; }, mxGo: "Boshlash", mxHint: "Maxluqni o'z yemishi bilan juftlang", mxPeek: "Kartalarni eslab qoling…",
          mxNew: "Yangi maxluq. Nima yeyishini eslab qoling.", mxOld: "Yangi maxluq yo'q — endi kartalar ko'proq.", mxOk: function (c, f) { return c + " — " + f + ". Barakalla!"; },
          mxBad: "Yo'q, bu uning yemishi emas.", mxBir: "Bular bir xil turdagi kartalar — maxluqqa yemish toping.", mxXgN: "Xagrid",
          mxStat: function (m, k) { return "Xato juftlik: " + m + " · " + (k ? "Sham o'chdi" : "Vaqtida"); },
          mxXgB: ["Maxluqlar och qoldi. Hechqisi yo'q, yana urinib ko'ring.", "Hali chalkashtiryapsiz. Shoshilmang, qaytadan.", "Yomon emas! Hech kim tishlamadi — yaxshi boshlanish.", "Zo'r! Maxluqlar sizni yoqtirib qoldi.", "Qoyil! Sizdan haqiqiy maxluqshunos chiqadi."],
          qrT: "Qo'riqxona", qrSum: function (a, b) { return a + " / " + b + " maxluq"; }, qrGal: function (n) { return n + " galleon"; },
          qrTip: "Maxluqlar darslardan keladi: har uch darsda bittasi. Har birini kuniga bir marta boqing — o'sadi. Katta bo'lgach har biri o'z foydasini beradi.",
          qrSt: ["Bola", "O'smir", "Katta"], qrNext: function (n, st) { return "Yana " + n + " marta boqilsa — " + st.toLowerCase(); }, qrGift: function (n) { return "Sovg'agacha " + n + " marta boqish"; },
          qrFood: function (nom, n) { return nom + ": " + n + " porsiya"; }, qrFeed: "Boqish", qrFed: "Bugun to'ydi", qrBuy: function (g, n) { return "Yemish · " + g + " galleon (" + n + " ta)"; },
          qrAsk: function (yem, g, n, bor) { return "Yemish olinsinmi?\n\n«" + yem + "» — " + n + " porsiya, " + g + " galleon. Sizda " + bor + " galleon bor."; },
          qrPoor: "Galleon yetmaydi. Galleon hafta yakunida kubokdagi ballaringiz uchun beriladi.", qrLock: function (n) { return n + "-darsdan keyin"; }, qrRare: "Bellashuvda birinchi uchlikka kiring",
          qrGrew: function (nom, st) { return nom + " o'sdi — endi " + st.toLowerCase() + "!"; }, qrGot: function (nom, n) { return nom + " sizga " + n + " galleon keltirdi!"; },
          qrGotF: function (nom, n) { return nom + " boshqa maxluqlaringizga " + n + " porsiya yemish keltirdi!"; }, qrFy: "Foydasi", qrFyK: "Katta bo'lganda", qrYum: function (nom) { return nom + " to'ydi."; },
          qrOpenS: function (n) { return n ? n + " ta maxluq sizni kutmoqda" : "Birinchi maxluq 3-darsdan keyin keladi"; }, qrNew: function (nom) { return "Yangi maxluq: " + nom + "! U qo'riqxonangizda kutmoqda."; }, qrGo: "Qo'riqxonaga",
          ylStep: function (a, b) { return "Savol " + a + " / " + b; }, ylGo: "Boshlash", ylHint: "Aynan shu turkumni toping — u burilgan bo'ladi", ylNam: "Namuna",
          ylI: ["Tepada turkum namunasi turadi. Pastdagi shakllardan aynan o'shasini toping — u boshqa tomonga burilgan.", "Endi ehtiyot bo'ling: ba'zi shakllar turkumning ko'zgudagi aksi — ular to'g'ri javob emas.", "Variantlar oltita, ba'zisida bitta yulduz joyidan siljigan. Diqqat bilan qarang."],
          ylOk: ["To'g'ri!", "Aynan shu!", "Ko'zingiz o'tkir!"], ylBad: "Yo'q, bu boshqa shakl.", ylLate: "Vaqt tugadi.", ylSnN: "Professor Sinistra", ylStat: function (a, b) { return "To'g'ri: " + a + " / " + b; },
          ylB: ["Osmon sizga hali notanish. Qaytadan qarab chiqing.", "Yulduzlarni chalkashtiryapsiz. Yana bir urinib ko'ring.", "Qoniqarli. Osmon xaritasi esingizda qola boshladi.", "Juda yaxshi! Ko'zingiz o'tkir.", "A'lo! Yulduzlar sizga bo'ysunadi."],
          osStep: function (a, b) { return "Parvarish " + a + " / " + b; }, osGo: "Issiqxonaga", osHint: "Asbobni tanlang, keyin shu narsa kerak bo'lgan o'simlikni bosing",
          osI: ["O'simlik ustida nima kerakligi ko'rinadi. Pastdan o'sha asbobni tanlab, o'simlikni bosing. Chiziq tugaguncha ulgurmasangiz, o'simlik so'liydi.", "Yangi asbob qo'shildi. Bir vaqtning o'zida bir nechta o'simlikni kuzating.", "O'simliklar ko'paydi va talabchan bo'ldi. Ko'zingiz hammasida bo'lsin."],
          osAs: ["Suv", "Nur", "Qaychi", "O'g'it"], osOk: ["Yaxshi!", "Barakalla!", "Shunday!"], osBad: "Unga bu kerak emas!", osWilt: "O'simlik so'lidi!", osSpN: "Professor Sprout",
          osStat: function (a, b, x2) { return "Parvarish: " + a + " / " + b + " · Xato asbob: " + x2; },
          osB: ["Issiqxona xarob bo'ldi. Qo'lqopni kiying va qaytadan.", "O'simliklar sizdan xafa. Yana bir urinib ko'ring.", "Qoniqarli. O'simliklar tirik — bu yaxshi boshlanish.", "Juda yaxshi! Qo'lingiz yengil ekan.", "A'lo! Mandragoralar ham sizni tinglaydi."],
          tfStep: function (a, b) { return "Savol " + a + " / " + b; }, tfGo: "Boshlash", tfHint: "Afsun birinchi buyumni qanday o'zgartirdi? Ikkinchisiga ham shuni qo'llang",
          tfI: ["Tepada afsun bitta buyumni qanday o'zgartirgani ko'rinadi. Qoidani toping va xuddi shu afsun ikkinchi buyumni nimaga aylantirishini tanlang.", "Endi afsun bir vaqtda IKKI narsani o'zgartiradi — masalan, hajmini ham, sonini ham.", "Uchta o'zgarish birdan va oltita variant. Har belgini alohida tekshiring: turi, soni, hajmi, burilishi, nuri."],
          tfOk: ["To'g'ri!", "Aynan shunday!", "Qoidani topdingiz!"], tfBad: "Yo'q. Qoidaga yana bir qarang.", tfLate: "Vaqt tugadi.", tfMgN: "Professor Makgonagall",
          tfStat: function (a, b) { return "To'g'ri: " + a + " / " + b; },
          tfB: ["Bu transfiguratsiya emas, tasodif. Qaytadan.", "Qoidani ko'rmayapsiz. Diqqatni jamlang va yana urining.", "Qoniqarli. Qoidani topishni boshladingiz.", "Yaxshi ish. Fikrlashingiz tartibli.", "A'lo. Bunday aniq fikrlashni kam uchrataman."],
          qobT: "Qobiliyatlar", qobK: "Mening darajam", qobS: "Har fan boshqa qobiliyatni mashq qildiradi. Daraja o'tilgan darslar va baholaringizdan hisoblanadi.",
          qobBtn: "Qobiliyatlarim", qobBtnS: "Sakkiz soha bo'yicha darajangiz", qobUn: ["Yangi boshlovchi", "Shogird", "Mohir", "Usta", "Buyuk sehrgar"],
          qobZaif: function (nom) { return "Eng ko'p o'sish imkoni: " + nom; }, qobGo: function (fan) { return "«" + fan + "» darsiga o'tish"; }, qobEsl: "Qobiliyatlaringiz profilingizda boshqa sehrgarlarga ham ko'rinadi.",
          rekTileS: "Xatosiz kim uzoqqa boradi", rekHomeS: "Fanni tanlang. Bu yerda tezlik emas, chidam muhim: birinchi xatoda o'yin tugaydi. Kun oxirida har fanning birinchi uch rekordchisi ball oladi.", rekPrize: function (p) { return "Har kuni yarim tunda rekordchilarga ball: 1-o'rin +" + p[0] + ", 2-o'rin +" + p[1] + ", 3-o'rin +" + p[2] + "."; }, fnBell: "Bugungi bellashuv", fnRek: "Rekord", navHome: "Bosh sahifa", navMen: "Men", navChat: "Chat", pmQrS: function (n) { return n ? n + " ta maxluq" : "Maxluqlar darsidan olinadi"; },
          rekT: "Rekord", rekSec: "Rekordlar", rekRule: "Bu yerda tezlik emas, chidam muhim: xatosiz kim uzoqqa boradi. Birinchi xatoda o'yin tugaydi. Jadval doimiy: eng yaxshi natijangiz unda qoladi.",
          rekWeek: "O'rningiz", rekAll: "Rekordingiz", rekGo: "Boshlash", rekTop: "Rekordchilar", rekEmpty: "Hali hech kim urinmadi. Birinchi bo'ling!",
          rekRes: "Natija", rekNew: "Yangi rekord!", rekOld: function (n) { return "Rekordingiz: " + n; }, rekAgain: "Yana urinish", rekBack: "Rekordlar jadvali",
          rekCard: function (a) { return a ? "Rekordingiz: " + a : "Hali urinmagansiz"; }, rekPlace: function (p, n) { return n + " kishi ichida"; },
          ikImt: "Imtihon", ikYop: function (n) { return "Retsept " + n + " soniyadan keyin yopiladi"; }, ikXato: function (n) { return "Xato: " + n; },
          ikVaqt: ["Vaqtida", "Sham o'chdi"], ikSnN: "Professor Sneyp", ikTogri: ["Hm. To'g'ri.", "Davom eting.", "Shunday."],
          ikSnB: ["Bu damlama emas, bu falokat. Qaytadan.", "Achinarli. Retseptni o'qishni ham bilmaysizmi?", "Qoniqarli. Hech kim zaharlanmaydi — shunisi ham katta gap.", "Yomon emas. Sizdan buni kutmagan edim.", "A'lo. Bu so'zni tez-tez aytmayman."], ikStep: function (a, b) { return a + " / " + b; } },
    ru: { kick: "Хогвартс", ttl: "Уроки", tile: "Уроки", tileNew: function (n) { return "Заданий на сегодня: " + n; }, tileDone: "Уроки и состязания",
          sum: function (a, b) { return "Пройдено уроков: " + a + " / " + b; }, note: "Уроки — тренировка без ограничений. Очки даются в разделе «Состязания».",
          pts: function (n) { return "+" + n + " очков"; }, done: "Сделано", soon: "Скоро", go: "На урок", again: "Потренироваться",
          of: function (a, b) { return a + " / " + b + " уроков"; }, lessons: "Уроки", lessonsS: "Тренировка: очки не даются, проходите сколько хотите. Очки — в разделе «Состязания».",
          blTile: "Состязания", blTileNew: function (n) { return "Сегодня ждут состязания: " + n; }, blTileDone: "Сегодня вы участвовали во всех",
          blHomeS: "Очки набирают здесь. Каждый день новое задание — одинаковое для всех; кто быстрее и без ошибок, завтра получит очки.",
          chessT: "Волшебные шахматы", chessS: "Играйте с живым соперником · победа +10 очков", tileProg: function (a, b) { return "Пройдено уроков: " + a + " / " + b; },
          locked: "Сначала пройдите предыдущий урок", passed: function (n) { return "Урок " + n + " пройден"; }, again2: "Этот урок уже был пройден — вы потренировались.",
          next: "Следующий урок", toList: "К списку уроков", allDone: "Все уроки пройдены",
          dailyT: "Вопрос дня", dailyNew: "Ждёт сегодняшний вопрос", dailyDone: "На сегодняшний вопрос вы ответили",
          bellCard: "Состязание дня", bellIn: "К состязанию", tarixItem: function (n) { return n + " вопросов"; },
          trQ: function (a, b) { return "Вопрос " + a + " / " + b; }, trRes: function (a, b) { return "Верно " + a + " из " + b; },
          trFail: function (n, j) { return n >= j ? "Чтобы перейти к следующему уроку, нужно ответить верно на все вопросы." : "Чтобы пройти урок, нужно минимум верных ответов: " + n + "."; }, retry: "Ещё раз", loadQ: "Вопросы открываются…",
          lvl: function (n) { return "Урок " + n; }, lvlDone: function (n) { return "Пройдено уроков: " + n; },
          bell: "Состязание", bellS: "Очки дают здесь: одно задание в день — одинаковое для всех. Кто быстрее и без ошибок, завтра получит очки.",
          bellOf: function (f) { return f + ": состязание"; }, bellNone: "Вы ещё не участвовали", bellGo: "Начать", bellNo: "Попытки на сегодня закончились",
          tries: function (n) { return "Осталось попыток: " + n; }, place: function (n, j) { return n + "-е место из " + j; },
          prizes: function (a, b, c, d) { return "1-е место +" + a + " · 2-е +" + b + " · 3-е +" + c + " · 4–10-е +" + d + " очков"; },
          rule: "Время идёт с нажатия «Начать». Каждая ошибка +3 секунды. Засчитывается лучшая попытка.",
          topT: "Таблица дня", topNone: "Пока никто не участвовал — будьте первым!", yest: "Вчерашние победители",
          yestMe: function (n, p) { return "Вчера вы на " + n + "-м месте" + (p ? " · +" + p + " очков" : ""); }, sec: function (ms) { return (ms / 1000).toFixed(1) + " с"; },
          leftT: function (h, m) { return "До конца " + (h ? h + " ч " : "") + m + " мин"; }, ptsW: "очков", meK: "Ваш результат", meBest: "Ваш лучший результат",
          you: "вы", resT: function (t) { return "Ваш результат: " + t; }, resBest: function (t) { return "Лучший результат: " + t; },
          bellBack: "К таблице", timer: "Время идёт",
          today: "Тема дня", back: "К урокам", got: function (n) { return "+" + n + " очков вашему факультету"; },
          practice: "Этот урок сегодня уже сделан — за тренировку очки не даются.", fail: "Не получилось, попробуйте чуть позже",
          afStep: function (a, b) { return "Попытка " + a + " / " + b; },
          afR: ["Ведите по линии", "Линия бледная — внимательнее", "Теперь по памяти"],
          afStart: "Начните со светящейся точки", afOff: "Палочка ушла в сторону — ещё раз", afShort: "Доведите движение до конца",
          afOk: ["Хорошо! Ещё раз.", "Отлично! Теперь по памяти.", "Браво! Заклинание освоено."], afShow: "Показать линию",
          afBaho: ["Тролль", "Слабо", "Удовлетворительно", "Выше ожидаемого", "Превосходно"], afBahoT: "Оценка", afAcc: function (p) { return "Точность " + p + "%"; }, afVaqt: function (a, b) { return "Вовремя " + a + " / " + b; },
          afLow: "Чтобы перейти к следующему уроку, нужна оценка не ниже «Удовлетворительно».",
          afNth: function (a, b) { return "Заклинание " + a + " / " + b; }, afVazT: "Какое заклинание нужно?", afVazK: "Ситуация", afZanK: "Серия заклинаний", afVazNo: "Это заклинание не поможет",
          afFlN: "Профессор Флитвик",
          afFl: { a: ["Превосходно, очень точно!", "Браво! Отличное движение кисти.", "Блестяще! Как в учебнике."],
                  b: ["Неплохо. Держите кисть мягче.", "Сносно, но не уходите от линии.", "Годится. Чуть больше внимания!"],
                  c: ["Быстрее — свеча ждать не будет!", "Верно, но слишком медленно."] },
          afFlB: ["Так и палочка обидится. Ещё раз!", "Нужно ещё потренироваться. Попробуйте снова.", "Удовлетворительно. С практикой выйдет лучше.", "Очень хорошо! Ещё чуть-чуть — и будет «Превосходно».", "Превосходно! Ваш факультет может вами гордиться."], afPuf: "Заклинание не получилось…", afKech: "свеча погасла",
          ikRec: "Рецепт", ikRecS: "Запомните порядок ингредиентов — потом рецепт закроется.", ikGo: "Готов",
          ikCook: "Кладите ингредиенты в котёл по порядку", ikErr: function (a, b) { return "Ошибки: " + a + " / " + b; },
          ikBad: ["Неверно. Внимательнее!", "Опять ошибка. Котёл закипает…"], ikBoom: "Зелье испорчено. Прочитайте рецепт ещё раз.",
          hmStep: function (a, b) { return "Опасность " + a + " / " + b; }, hmGo: "Начать", hmNew: "Новая опасность. Запомните, какое заклинание поможет.",
          hmOld: "Новых опасностей нет. Теперь их больше и они быстрее.", hmHint: "Выберите верную защиту", hmOk: ["Превосходно!", "Очень хорошо!", "Именно так!"],
          hmBad: "Это не поможет!", hmLate: "Слишком поздно!", hmLpN: "Профессор Люпин", hmStat: function (w, l) { return "Ошибок: " + w + " · Опозданий: " + l; },
          hmLpB: ["Ничего страшного. Съешьте шоколад и попробуйте снова.", "Вы пока не готовы, но этому можно научиться. Ещё раз.", "Удовлетворительно. Вы не растерялись перед опасностью.", "Очень хорошо! Вы становитесь быстрее.", "Превосходно! Такую защиту я вижу редко."],
          ucStep: function (a, b) { return "Кольцо " + a + " / " + b; }, ucGo: "В полёт!", ucHint: "Ведите пальцем влево и вправо",
          ucIntro: ["Управляйте метлой пальцем влево-вправо и пролетайте через центр золотых колец. Пройдёте несколько подряд — ускоритесь.", "Сегодня на поле бладжеры. Не сталкивайтесь с ними — после трёх ударов урок окончен.", "Мимо пролетит золотой снитч. Поймаете — оценка будет выше.", "На метлу! Кольца сужаются, скорость растёт."],
          ucOk: ["Хорошо!", "Вот так!", "Отлично!"], ucMiss: "Кольцо пропущено!", ucHit: "Бладжер! Осторожнее!", ucSn: "Снитч пойман!", ucXcN: "Мадам Трюк",
          ucStat: function (a, b, z, sn) { return "Кольца: " + a + " / " + b + " · Ударов: " + z + (sn ? " · Снитч" : ""); },
          ucXcB: ["Слезайте с метлы. Сначала потренируемся на земле.", "Рано. Смотрите на кольца, а не в небо!", "Удовлетворительно. Метла начинает вас слушаться.", "Хороший полёт! Твёрдая рука.", "Превосходно! Из вас выйдет отличный ловец."],
          mxStep: function (a, b) { return "Пара " + a + " / " + b; }, mxGo: "Начать", mxHint: "Подберите существу его корм", mxPeek: "Запоминайте карты…",
          mxNew: "Новое существо. Запомните, чем оно питается.", mxOld: "Новых существ нет — теперь карт больше.", mxOk: function (c, f) { return c + " — " + f + ". Молодец!"; },
          mxBad: "Нет, это не его корм.", mxBir: "Это карты одного вида — найдите существу корм.", mxXgN: "Хагрид",
          mxStat: function (m, k) { return "Неверных пар: " + m + " · " + (k ? "Свеча погасла" : "Вовремя"); },
          mxXgB: ["Существа остались голодными. Ничего, попробуйте ещё раз.", "Пока путаете. Не спешите, давайте заново.", "Неплохо! Никто не укусил — хорошее начало.", "Здорово! Вы понравились существам.", "Вот это да! Из вас выйдет настоящий знаток существ."],
          qrT: "Питомник", qrSum: function (a, b) { return "Существ: " + a + " / " + b; }, qrGal: function (n) { return n + " галлеонов"; },
          qrTip: "Существа приходят с уроков: одно за каждые три урока. Кормите каждого раз в день — оно растёт. Когда вырастет, каждое приносит свою пользу.",
          qrSt: ["Малыш", "Подросток", "Взрослый"], qrNext: function (n, st) { return "Ещё кормлений: " + n + " — и " + st.toLowerCase(); }, qrGift: function (n) { return "До подарка кормлений: " + n; },
          qrFood: function (nom, n) { return nom + ": порций — " + n; }, qrFeed: "Покормить", qrFed: "Сегодня сыт", qrBuy: function (g, n) { return "Корм · " + g + " галлеон (" + n + " шт.)"; },
          qrAsk: function (yem, g, n, bor) { return "Купить корм?\n\n«" + yem + "» — порций: " + n + ", цена: " + g + " галлеон. У вас галлеонов: " + bor + "."; },
          qrPoor: "Не хватает галлеонов. Галлеоны выдают в конце недели за очки в кубке.", qrLock: function (n) { return "После урока " + n; }, qrRare: "Войдите в тройку лучших в состязании",
          qrGrew: function (nom, st) { return nom + " вырос — теперь " + st.toLowerCase() + "!"; }, qrGot: function (nom, n) { return nom + " принёс вам галлеонов: " + n + "!"; },
          qrGotF: function (nom, n) { return nom + " принёс другим существам порций корма: " + n + "!"; }, qrFy: "Польза", qrFyK: "Когда вырастет", qrYum: function (nom) { return nom + " сыт."; },
          qrOpenS: function (n) { return n ? "Вас ждут существа: " + n : "Первое существо появится после 3-го урока"; }, qrNew: function (nom) { return "Новое существо: " + nom + "! Оно ждёт вас в питомнике."; }, qrGo: "В питомник",
          ylStep: function (a, b) { return "Вопрос " + a + " / " + b; }, ylGo: "Начать", ylHint: "Найдите это же созвездие — оно повёрнуто", ylNam: "Образец",
          ylI: ["Наверху образец созвездия. Найдите среди фигур внизу именно его — оно повёрнуто в другую сторону.", "Теперь осторожнее: некоторые фигуры — зеркальное отражение созвездия, это неверный ответ.", "Вариантов шесть, в некоторых одна звезда сдвинута. Смотрите внимательно."],
          ylOk: ["Верно!", "Именно оно!", "У вас острый глаз!"], ylBad: "Нет, это другая фигура.", ylLate: "Время вышло.", ylSnN: "Профессор Синистра", ylStat: function (a, b) { return "Верно: " + a + " / " + b; },
          ylB: ["Небо вам пока незнакомо. Посмотрите ещё раз.", "Вы путаете звёзды. Попробуйте снова.", "Удовлетворительно. Карта неба начинает запоминаться.", "Очень хорошо! У вас острый глаз.", "Превосходно! Звёзды вам послушны."],
          osStep: function (a, b) { return "Уход " + a + " / " + b; }, osGo: "В теплицу", osHint: "Выберите инструмент, затем нажмите на растение, которому он нужен",
          osI: ["Над растением видно, что ему нужно. Выберите внизу этот инструмент и нажмите на растение. Не успеете до конца полоски — растение завянет.", "Добавился новый инструмент. Следите сразу за несколькими растениями.", "Растений стало больше, и они требовательнее. Держите в поле зрения все."],
          osAs: ["Вода", "Свет", "Ножницы", "Удобрение"], osOk: ["Хорошо!", "Молодец!", "Вот так!"], osBad: "Ему нужно другое!", osWilt: "Растение завяло!", osSpN: "Профессор Стебль",
          osStat: function (a, b, x2) { return "Уход: " + a + " / " + b + " · Не тот инструмент: " + x2; },
          osB: ["Теплица в плачевном виде. Наденьте перчатки — и заново.", "Растения на вас обижены. Попробуйте ещё раз.", "Удовлетворительно. Растения живы — хорошее начало.", "Очень хорошо! У вас лёгкая рука.", "Превосходно! Вас слушаются даже мандрагоры."],
          tfStep: function (a, b) { return "Вопрос " + a + " / " + b; }, tfGo: "Начать", tfHint: "Как заклинание изменило первый предмет? Примените то же ко второму",
          tfI: ["Наверху видно, как заклинание изменило один предмет. Найдите правило и выберите, во что то же заклинание превратит второй предмет.", "Теперь заклинание меняет сразу ДВА признака — например, и размер, и количество.", "Три изменения сразу и шесть вариантов. Проверяйте каждый признак отдельно: вид, количество, размер, поворот, сияние."],
          tfOk: ["Верно!", "Именно так!", "Вы нашли правило!"], tfBad: "Нет. Посмотрите на правило ещё раз.", tfLate: "Время вышло.", tfMgN: "Профессор Макгонагалл",
          tfStat: function (a, b) { return "Верно: " + a + " / " + b; },
          tfB: ["Это не трансфигурация, а случайность. Заново.", "Вы не видите правила. Соберитесь и попробуйте ещё раз.", "Удовлетворительно. Вы начали находить правило.", "Хорошая работа. Вы мыслите последовательно.", "Превосходно. Такую ясность мысли я встречаю редко."],
          qobT: "Способности", qobK: "Мой уровень", qobS: "Каждый предмет тренирует свою способность. Уровень считается по пройденным урокам и вашим оценкам.",
          qobBtn: "Мои способности", qobBtnS: "Ваш уровень в восьми областях", qobUn: ["Новичок", "Ученик", "Умелец", "Мастер", "Великий волшебник"],
          qobZaif: function (nom) { return "Больше всего можно вырасти: " + nom; }, qobGo: function (fan) { return "К уроку «" + fan + "»"; }, qobEsl: "Ваши способности видны другим волшебникам в вашем профиле.",
          rekTileS: "Кто пройдёт дальше без ошибок", rekHomeS: "Выберите предмет. Здесь важна не скорость, а выдержка: игра заканчивается на первой ошибке. В конце дня трое лучших по каждому предмету получают очки.", rekPrize: function (p) { return "Каждую полночь рекордсмены получают очки: 1-е место +" + p[0] + ", 2-е +" + p[1] + ", 3-е +" + p[2] + "."; }, fnBell: "Состязание дня", fnRek: "Рекорд", navHome: "Главная", navMen: "Я", navChat: "Чат", pmQrS: function (n) { return n ? "Существ: " + n : "Появляются на уроках ухода"; },
          rekT: "Рекорд", rekSec: "Рекорды", rekRule: "Здесь важна не скорость, а выдержка: кто пройдёт дальше без ошибок. Игра заканчивается на первой ошибке. Таблица постоянная: ваш лучший результат остаётся в ней.",
          rekWeek: "Ваше место", rekAll: "Ваш рекорд", rekGo: "Начать", rekTop: "Рекордсмены", rekEmpty: "Ещё никто не пробовал. Будьте первым!",
          rekRes: "Результат", rekNew: "Новый рекорд!", rekOld: function (n) { return "Ваш рекорд: " + n; }, rekAgain: "Ещё раз", rekBack: "Таблица рекордов",
          rekCard: function (a) { return a ? "Ваш рекорд: " + a : "Вы ещё не пробовали"; }, rekPlace: function (p, n) { return "участников: " + n; },
          ikImt: "Экзамен", ikYop: function (n) { return "Рецепт закроется через " + n + " с"; }, ikXato: function (n) { return "Ошибок: " + n; },
          ikVaqt: ["Вовремя", "Свеча погасла"], ikSnN: "Профессор Снегг", ikTogri: ["Хм. Верно.", "Продолжайте.", "Так."],
          ikSnB: ["Это не зелье, это катастрофа. Заново.", "Прискорбно. Вы и рецепт прочесть не способны?", "Удовлетворительно. Никто не отравится — уже достижение.", "Неплохо. От вас я этого не ожидал.", "Превосходно. Я нечасто произношу это слово."],
          ikOk: "Зелье готово. Профессор Снегг… ничего не сказал. Это похвала.", ikStep: function (a, b) { return a + " / " + b; } },
    en: { kick: "Hogwarts", ttl: "Classes", tile: "Classes", tileNew: function (n) { return n + " tasks waiting today"; }, tileDone: "Lessons and contests",
          sum: function (a, b) { return a + " / " + b + " lessons completed"; }, note: "Lessons are practice — as many as you like. Points are won in Contests.",
          pts: function (n) { return "+" + n + " points"; }, done: "Done", soon: "Coming soon", go: "Enter class", again: "Practise",
          of: function (a, b) { return a + " / " + b + " lessons"; }, lessons: "Lessons", lessonsS: "Practice: no points, do as many as you like. Points are won in Contests.",
          blTile: "Contests", blTileNew: function (n) { return n + " contests waiting today"; }, blTileDone: "You took part in all of today's",
          blHomeS: "This is where points are won. A new task every day — the same for everyone; the fastest with no mistakes get points tomorrow.",
          chessT: "Wizard's Chess", chessS: "Play a live opponent · +10 points for a win", tileProg: function (a, b) { return a + " / " + b + " lessons completed"; },
          locked: "Finish the previous lesson first", passed: function (n) { return "Lesson " + n + " completed"; }, again2: "You had completed this lesson before — good practice.",
          next: "Next lesson", toList: "Lesson list", allDone: "All lessons completed",
          dailyT: "Daily question", dailyNew: "Today's question is waiting", dailyDone: "You answered today's question",
          bellCard: "Today's contest", bellIn: "Enter the contest", tarixItem: function (n) { return n + " questions"; },
          trQ: function (a, b) { return "Question " + a + " / " + b; }, trRes: function (a, b) { return a + " of " + b + " correct"; },
          trFail: function (n, j) { return n >= j ? "To move on, you need to answer every question correctly." : "You need at least " + n + " correct answers to pass."; }, retry: "Try again", loadQ: "Opening the questions…",
          lvl: function (n) { return "Lesson " + n; }, lvlDone: function (n) { return n + " lessons completed"; },
          bell: "Contest", bellS: "Points are won here: one task a day — the same for everyone. The fastest with no mistakes get points tomorrow.",
          bellOf: function (f) { return f + " contest"; }, bellNone: "You have not taken part yet", bellGo: "Start", bellNo: "No attempts left today",
          tries: function (n) { return n + " attempts left"; }, place: function (n, j) { return "Place " + n + " of " + j; },
          prizes: function (a, b, c, d) { return "1st +" + a + " · 2nd +" + b + " · 3rd +" + c + " · 4th–10th +" + d + " points"; },
          rule: "The clock starts when you press Start. Each mistake adds 3 seconds. Your best attempt counts.",
          topT: "Today's table", topNone: "Nobody has taken part yet — be the first!", yest: "Yesterday's winners",
          yestMe: function (n, p) { return "Yesterday you were " + n + (p ? " · +" + p + " points" : ""); }, sec: function (ms) { return (ms / 1000).toFixed(1) + " s"; },
          leftT: function (h, m) { return "Ends in " + (h ? h + " h " : "") + m + " min"; }, ptsW: "points", meK: "Your result", meBest: "Your best result",
          you: "you", resT: function (t) { return "Your result: " + t; }, resBest: function (t) { return "Your best: " + t; },
          bellBack: "Back to the table", timer: "The clock is running",
          today: "Today's topic", back: "Back to classes", got: function (n) { return "+" + n + " points for your house"; },
          practice: "This class is already done today — practice gives no points.", fail: "That didn't work, please try again shortly",
          afStep: function (a, b) { return "Attempt " + a + " / " + b; },
          afR: ["Trace along the line", "The line is faint — careful", "Now from memory"],
          afStart: "Start from the glowing dot", afOff: "The wand went astray — again", afShort: "Finish the whole movement",
          afOk: ["Good! Once more.", "Excellent! Now from memory.", "Bravo! The charm is learnt."], afShow: "Show the line",
          afBaho: ["Troll", "Poor", "Acceptable", "Exceeds Expectations", "Outstanding"], afBahoT: "Grade", afAcc: function (p) { return "Accuracy " + p + "%"; }, afVaqt: function (a, b) { return "In time " + a + " / " + b; },
          afLow: "You need at least “Acceptable” to move on.",
          afNth: function (a, b) { return "Spell " + a + " / " + b; }, afVazT: "Which spell do you need?", afVazK: "Situation", afZanK: "Spell chain", afVazNo: "That spell won't help",
          afFlN: "Professor Flitwick",
          afFl: { a: ["Splendid, very precise!", "Bravo! Lovely wrist movement.", "Excellent! Just like the textbook."],
                  b: ["Not bad. Keep your wrist looser.", "Passable, but stay close to the line.", "That will do. A little more care!"],
                  c: ["Quicker — the candle won't wait!", "Correct, but far too slow."] },
          afFlB: ["Even the wand is offended. Again!", "More practice needed. Try once more.", "Acceptable. Practice will make it better.", "Very good! A little more and it's Outstanding.", "Outstanding! Your house can be proud of you."], afPuf: "The spell fizzled…", afKech: "the candle went out",
          ikRec: "Recipe", ikRecS: "Memorise the order of the ingredients — then the recipe closes.", ikGo: "Ready",
          ikCook: "Add the ingredients to the cauldron in order", ikErr: function (a, b) { return "Mistakes: " + a + " / " + b; },
          ikBad: ["Wrong. Pay attention!", "Wrong again. The cauldron is boiling over…"], ikBoom: "The potion is ruined. Read the recipe again.",
          hmStep: function (a, b) { return "Danger " + a + " / " + b; }, hmGo: "Begin", hmNew: "A new danger. Remember which spell helps.",
          hmOld: "No new dangers. Now there are more of them, and they are faster.", hmHint: "Pick the right defence", hmOk: ["Excellent!", "Very good!", "Exactly!"],
          hmBad: "That won't help!", hmLate: "Too late!", hmLpN: "Professor Lupin", hmStat: function (w, l) { return "Mistakes: " + w + " · Too late: " + l; },
          hmLpB: ["Never mind. Eat some chocolate and try again.", "You are not ready yet, but this can be learnt. Once more.", "Acceptable. You kept your head in the face of danger.", "Very good! You are getting quicker.", "Outstanding! I rarely see a defence like that."],
          ucStep: function (a, b) { return "Hoop " + a + " / " + b; }, ucGo: "Take off!", ucHint: "Slide your finger left and right",
          ucIntro: ["Steer the broom left and right with your finger and fly through the middle of the golden hoops. String several together and you speed up.", "There are Bludgers on the pitch today. Don't hit them — three knocks and the lesson is over.", "The Golden Snitch will fly past too. Catch it and your grade goes up.", "Mount your broom! The hoops get narrower and the pace quicker."],
          ucOk: ["Good!", "That's it!", "Splendid!"], ucMiss: "Missed the hoop!", ucHit: "Bludger! Watch out!", ucSn: "Snitch caught!", ucXcN: "Madam Hooch",
          ucStat: function (a, b, z, sn) { return "Hoops: " + a + " / " + b + " · Knocks: " + z + (sn ? " · Snitch" : ""); },
          ucXcB: ["Off the broom. We'll practise on the ground first.", "Too soon. Eyes on the hoops, not the sky!", "Acceptable. The broom is starting to listen to you.", "Good flying! A steady hand.", "Outstanding! You'd make a fine Seeker."],
          mxStep: function (a, b) { return "Pair " + a + " / " + b; }, mxGo: "Begin", mxHint: "Match each creature with its food", mxPeek: "Memorise the cards…",
          mxNew: "A new creature. Remember what it eats.", mxOld: "No new creatures — more cards now.", mxOk: function (c, f) { return c + " — " + f + ". Well done!"; },
          mxBad: "No, that's not its food.", mxBir: "Those are the same kind of card — find the creature its food.", mxXgN: "Hagrid",
          mxStat: function (m, k) { return "Wrong pairs: " + m + " · " + (k ? "The candle went out" : "In time"); },
          mxXgB: ["The creatures went hungry. Never mind, have another go.", "Still mixing them up. Take your time, try again.", "Not bad! Nobody got bitten — a good start.", "Brilliant! The creatures have taken to you.", "Blimey! You'll make a proper creature expert."],
          qrT: "Menagerie", qrSum: function (a, b) { return a + " / " + b + " creatures"; }, qrGal: function (n) { return n + " Galleons"; },
          qrTip: "Creatures come from lessons: one for every three lessons. Feed each once a day and it grows. Once grown, each one brings its own benefit.",
          qrSt: ["Baby", "Youngster", "Adult"], qrNext: function (n, st) { return n + " more feedings to " + st.toLowerCase(); }, qrGift: function (n) { return n + " feedings until a gift"; },
          qrFood: function (nom, n) { return nom + ": " + n + " portions"; }, qrFeed: "Feed", qrFed: "Fed today", qrBuy: function (g, n) { return "Food · " + g + " Galleon (" + n + ")"; },
          qrAsk: function (yem, g, n, bor) { return "Buy food?\n\n“" + yem + "” — " + n + " portions for " + g + " Galleon. You have " + bor + " Galleons."; },
          qrPoor: "Not enough Galleons. Galleons are paid at the end of each week for your House Cup points.", qrLock: function (n) { return "After lesson " + n; }, qrRare: "Finish in the contest top three",
          qrGrew: function (nom, st) { return nom + " has grown — now " + st.toLowerCase() + "!"; }, qrGot: function (nom, n) { return nom + " brought you " + n + " Galleon" + (n > 1 ? "s" : "") + "!"; },
          qrGotF: function (nom, n) { return nom + " brought " + n + " portions of food for your other creatures!"; }, qrFy: "Benefit", qrFyK: "When grown", qrYum: function (nom) { return nom + " is full."; },
          qrOpenS: function (n) { return n ? n + " creatures are waiting for you" : "Your first creature arrives after lesson 3"; }, qrNew: function (nom) { return "A new creature: " + nom + "! It is waiting in your menagerie."; }, qrGo: "To the menagerie",
          ylStep: function (a, b) { return "Question " + a + " / " + b; }, ylGo: "Begin", ylHint: "Find this same constellation — it has been turned", ylNam: "Sample",
          ylI: ["The sample constellation is at the top. Find exactly that one among the shapes below — it has been turned round.", "Careful now: some shapes are the mirror image of the constellation — those are wrong.", "Six options, and in some a single star has been moved. Look closely."],
          ylOk: ["Correct!", "That's the one!", "A sharp eye!"], ylBad: "No, that's a different shape.", ylLate: "Time's up.", ylSnN: "Professor Sinistra", ylStat: function (a, b) { return "Correct: " + a + " / " + b; },
          ylB: ["The sky is still a stranger to you. Look again.", "You are mixing up the stars. Try once more.", "Acceptable. The sky map is starting to stick.", "Very good! You have a sharp eye.", "Outstanding! The stars obey you."],
          osStep: function (a, b) { return "Care " + a + " / " + b; }, osGo: "To the greenhouse", osHint: "Pick a tool, then tap the plant that needs it",
          osI: ["Each plant shows what it needs. Pick that tool below and tap the plant. If the bar runs out first, the plant wilts.", "A new tool has been added. Keep an eye on several plants at once.", "More plants now, and fussier ones. Watch them all."],
          osAs: ["Water", "Light", "Shears", "Fertiliser"], osOk: ["Good!", "Well done!", "That's it!"], osBad: "That's not what it needs!", osWilt: "The plant has wilted!", osSpN: "Professor Sprout",
          osStat: function (a, b, x2) { return "Care: " + a + " / " + b + " · Wrong tool: " + x2; },
          osB: ["The greenhouse is a wreck. Gloves on, and start again.", "The plants are cross with you. Try once more.", "Acceptable. The plants are alive — a good start.", "Very good! You have green fingers.", "Outstanding! Even the Mandrakes listen to you."],
          tfStep: function (a, b) { return "Question " + a + " / " + b; }, tfGo: "Begin", tfHint: "How did the spell change the first object? Do the same to the second",
          tfI: ["The top row shows how the spell changed one object. Work out the rule and pick what the same spell turns the second object into.", "Now the spell changes TWO things at once — size and number, for example.", "Three changes at once and six options. Check each feature separately: kind, number, size, turn, glow."],
          tfOk: ["Correct!", "Exactly!", "You found the rule!"], tfBad: "No. Look at the rule again.", tfLate: "Time's up.", tfMgN: "Professor McGonagall",
          tfStat: function (a, b) { return "Correct: " + a + " / " + b; },
          tfB: ["That is not Transfiguration, that is chance. Again.", "You are not seeing the rule. Concentrate and try once more.", "Acceptable. You are beginning to find the rule.", "Good work. Your thinking is orderly.", "Outstanding. I rarely meet such clear reasoning."],
          qobT: "Abilities", qobK: "My level", qobS: "Each subject trains a different ability. Your level comes from the lessons you have passed and your grades.",
          qobBtn: "My abilities", qobBtnS: "Your level in eight areas", qobUn: ["Beginner", "Apprentice", "Skilled", "Master", "Great wizard"],
          qobZaif: function (nom) { return "Most room to grow: " + nom; }, qobGo: function (fan) { return "Go to " + fan; }, qobEsl: "Other wizards can see your abilities in your profile.",
          rekTileS: "Who gets furthest without a mistake", rekHomeS: "Pick a subject. This is about endurance, not speed: the game ends on your first mistake. At the end of each day the top three in every subject earn points.", rekPrize: function (p) { return "Every midnight the record holders earn points: 1st +" + p[0] + ", 2nd +" + p[1] + ", 3rd +" + p[2] + "."; }, fnBell: "Today's contest", fnRek: "Record", navHome: "Home", navMen: "Me", navChat: "Chat", pmQrS: function (n) { return n ? n + " creatures" : "Earned in Care of Magical Creatures"; },
          rekT: "Record", rekSec: "Records", rekRule: "This is about endurance, not speed: who gets furthest without a mistake. The game ends on your first mistake. The table is permanent: your best result stays on it.",
          rekWeek: "Your place", rekAll: "Your record", rekGo: "Begin", rekTop: "Record holders", rekEmpty: "Nobody has tried yet. Be the first!",
          rekRes: "Result", rekNew: "New record!", rekOld: function (n) { return "Your record: " + n; }, rekAgain: "Try again", rekBack: "Records table",
          rekCard: function (a) { return a ? "Your record: " + a : "Not tried yet"; }, rekPlace: function (p, n) { return "of " + n; },
          ikImt: "Exam", ikYop: function (n) { return "The recipe closes in " + n + " s"; }, ikXato: function (n) { return "Mistakes: " + n; },
          ikVaqt: ["In time", "The candle went out"], ikSnN: "Professor Snape", ikTogri: ["Hm. Correct.", "Continue.", "Indeed."],
          ikSnB: ["That is not a potion, it is a disaster. Again.", "Pitiful. Can you not even read a recipe?", "Acceptable. Nobody will be poisoned — an achievement in itself.", "Not bad. I did not expect that from you.", "Outstanding. I do not say that word often."],
          ikOk: "The potion is ready. Professor Snape… said nothing. That is praise.", ikStep: function (a, b) { return a + " / " + b; } }
  };

  var drData = null, drQayt = false, drBusy = false;

  function drX() { return DR_TX[lang] || DR_TX.uz; }
  function drInit() { try { return (tg && tg.initData) || ""; } catch (e) { return ""; } }
  function drFan(id) { for (var i = 0; i < DR_FANLAR.length; i++) { if (DR_FANLAR[i].id === id) { return DR_FANLAR[i]; } } return null; }
  function drEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text != null) { el.textContent = text; }
    return el;
  }
  function drImg(id) { return IMG_DIR + "dars/" + id + ".webp"; }

  // Mahalliy ko'rikda server yo'q - namuna
  var drLocalLvl = { tarix: 2, afsun: 40, iksir: 30, himoya: 26, uchish: 8, maxluq: 14, astro: 26, osimlik: 14, trans: 20 }, drLocalBest = {}, drLocalRek = { afsun: 14, himoya: 6 };
  function drSample(body) {
    body = body || {};
    var res = { ok: true };
    if (body.quiz) {
      res.level = body.quiz; res.need = 8;
      res.questions = [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
        return { q: "Namuna savol " + i + ": Xogvartsda nechta fakultet bor?", a: ["Oltita", "Uchta", "To'rtta", "Beshta"], c: 2 };
      });
      return res;
    }
    if (body.quiz_rek) {
      res.questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) { return { q: "Rekord savoli " + i + ": Xogvartsda nechta fakultet bor?", a: ["Oltita", "Uchta", "To'rtta", "Beshta"], c: 2 }; });
      return res;
    }
    if (body.record || body.records) {
      if (body.record) { drLocalRek[body.record] = Math.max(drLocalRek[body.record] || 0, body.score || 0); }
      res.records = {};
      DR_FANLAR.forEach(function (f) {
        var m = drLocalRek[f.id] || 0, top = [{ uid: 11, name: "Germiona", house: "gryffindor", score: 31 }, { uid: 12, name: "Luna", house: "ravenclaw", score: 22 }, { uid: 13, name: "Sedrik", house: "hufflepuff", score: 9 }];
        if (m) { top.push({ uid: 1, name: "Siz", house: "gryffindor", score: m, me: true }); }
        top.sort(function (p, q) { return q.score - p.score; });
        res.records[f.id] = { week: m, all: m, n: top.length, place: m ? top.findIndex(function (t) { return t.me; }) + 1 : null, top: f.id === "trans" ? [] : top };
      });
      return res;
    }
    if (body.done) {
      res["new"] = body.level === drLocalLvl[body.done] + 1;
      if (res["new"]) { drLocalLvl[body.done] = body.level; }
      res.pts = 0;
    }
    if (body.start === "tarix") {
      res.questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) { return { q: "Bellashuv savoli " + i + ": Garrining boyo'g'lisi nomi?", a: ["Errol", "Xedvig", "Skabbers", "Bakbik"] }; });
    }
    if (body.finish) {
      res.ms = 5200 + Math.round(Math.random() * 3000) + (body.xato || 0) * 3000;
      if (body.finish === "tarix") { res.wrong = 1; res.ms += 3000; }
      drLocalBest[body.finish] = Math.min(drLocalBest[body.finish] || 1e9, res.ms);
      res.best = drLocalBest[body.finish];
    }
    var bell = function (id, item) {
      var top = [{ uid: 11, name: "Germiona", house: "gryffindor", ms: 4300 }, { uid: 12, name: "Luna", house: "ravenclaw", ms: 5100 },
                 { uid: 13, name: "Sedrik", house: "hufflepuff", ms: 6900 }, { uid: 14, name: "Drako", house: "slytherin", ms: 8400 }];
      if (drLocalBest[id]) { top.push({ uid: 1, name: "Siz", house: "gryffindor", ms: drLocalBest[id], me: true }); }
      top.sort(function (p, q) { return p.ms - q.ms; });
      var orin = null;
      top.forEach(function (t, i) { if (t.me) { orin = i + 1; } });
      return { item: item, top: top, n: top.length, place: orin, ms: drLocalBest[id] || null, tries: drLocalBest[id] ? 1 : 0, max: 3,
               prizes: { top: [15, 10, 7], ten: 3 },
               yesterday: { top: top.slice(0, 3), n: 9, place: 4, pts: 3 } };
    };
    res.lessons = {
      tarix: { level: drLocalLvl.tarix, total: 46, contest: bell("tarix", "10") },
      afsun: { level: drLocalLvl.afsun, total: 48, contest: bell("afsun", "lumos") },
      iksir: { level: drLocalLvl.iksir, total: 36, contest: bell("iksir", "boils") },
      himoya: { level: drLocalLvl.himoya, total: 36, contest: bell("himoya", "dementor") },
      uchish: { level: drLocalLvl.uchish, total: 36, contest: bell("uchish", "y3") },
      maxluq: { level: drLocalLvl.maxluq, total: 36, contest: bell("maxluq", "m2") },
      astro: { level: drLocalLvl.astro, total: 36, contest: bell("astro", "a4") },
      osimlik: { level: drLocalLvl.osimlik, total: 36, contest: bell("osimlik", "o5") },
      trans: { level: drLocalLvl.trans, total: 36, contest: bell("trans", "t7") } };
    return res;
  }

  function drPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_DARS, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() },
                             body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.ok || res.error === "no_tries" || res.error === "not_started" || res.error === "locked") ? res : (MS_LOCAL ? drSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? drSample(body) : null); });
  }

  function drApply(res) {
    if (!res || !res.ok) { return; }
    var oldin = drPending();
    drData = res.lessons || {};
    if (!$("scr-dars").classList.contains("hidden")) { drRender(); }
    // Bosh sahifa FAQAT kartadagi son o'zgargan bo'lsa qayta chiziladi. DIQQAT (2026-10-07 xatosi): renderHub
    // drLoad ni chaqiradi - bu yerda shartsiz renderHub chaqirilsa cheksiz so'rov halqasi bo'ladi va ilova qotadi.
    if (drPending() !== oldin) { try { if (hubVisible()) { renderHub(); } } catch (e) {} }
  }

  // Bosh sahifa har chizilganda chaqiriladi: so'rov eng ko'pi bilan 20 soniyada bir marta ketadi
  var drAt = 0, drWait = false;
  function drLoad() {
    if (drWait || Date.now() - drAt < 20000) { return; }
    var ichkarida = false;
    try { ichkarida = hasHouse(); } catch (e) {}
    if (!ichkarida) { return; }
    drAt = Date.now();
    drWait = true;
    drPost({}, function (res) { drWait = false; drApply(res); });
  }

  // Bosh sahifadagi «Bellashuv» kartasi uchun: bugun hali qatnashilmagan bellashuvlar. Ma'lumot kelmagan bo'lsa -1.
  function drPending() {
    if (!drData) { return -1; }
    var n = 0;
    DR_FANLAR.forEach(function (f) {
      var st = f.on && drData[f.id];
      if (st && st.contest && !st.contest.tries) { n++; }
    });
    return n;
  }
  // «Darslar» kartasi uchun: [o'tilgan, jami] yoki null
  function drJami() {
    if (!drData) { return null; }
    var a = 0, b = 0;
    DR_FANLAR.forEach(function (f) { var st = f.on && drData[f.id]; if (st) { a += st.level; b += st.total; } });
    return [a, b];
  }

  // Shu qurilmada saqlangan eski baholarni serverga bir marta ko'chirish (2026-10-08 gacha baholar faqat qurilmada edi)
  function drBahoSync() {
    try {
      if (MS_LOCAL || localStorage.getItem("hp_baho_srv")) { return; }
      var hammasi = {}, bor = false;
      Object.keys(DR_BAHO_K).forEach(function (f) {
        var m = JSON.parse(localStorage.getItem(DR_BAHO_K[f]) || "{}") || {};
        if (Object.keys(m).length) { hammasi[f] = m; bor = true; }
      });
      if (!bor) { localStorage.setItem("hp_baho_srv", "1"); return; }
      drPost({ grades: hammasi }, function (res) {
        if (res && res.ok && res.synced != null) { try { localStorage.setItem("hp_baho_srv", "1"); } catch (e) {} if (res.lessons) { drData = res.lessons; } }
      });
    } catch (e) {}
  }
  function drOpen() {
    drQayt = false;
    qrLoad();
    drBahoSync();
    ["scr-hub", "scr-cat", "scr-cup", "scr-tasks", "scr-quiz", "scr-afsun", "scr-iksir", "scr-bell", "scr-blh", "scr-fan", "scr-tarix", "scr-himoya", "scr-uchish", "scr-maxluq", "scr-qoriq", "scr-issiq", "scr-duel", "scr-astro", "scr-osimlik", "scr-trans", "scr-qob", "scr-rek", "scr-sq", "pm"].forEach(function (id) {
      var el = $(id);
      if (el) { el.classList.add("hidden"); }
    });
    $("scr-dars").classList.remove("hidden");
    drRender();
    drPost({}, drApply);
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Darsdan (kunlik savol, o'yin) "ortga" bosilganda darslar ro'yxatiga qaytish
  function drBack() {
    if (!drQayt) { return false; }
    drQayt = false;
    drOpen();
    return true;
  }

  function drRender() {
    var x = drX(), box = $("dr-list");
    if ($("dr-qob")) { $("dr-qob-t").textContent = x.qobBtn; $("dr-qob-s").textContent = x.qobBtnS; }
    $("dr-kick").textContent = x.kick;
    $("dr-ttl").textContent = x.ttl;
    var ochiq = DR_FANLAR.filter(function (f) { return f.on; });
    var bajar = 0, jami = 0;
    ochiq.forEach(function (f) { var q = drData && drData[f.id]; bajar += q ? q.level : 0; jami += q ? q.total : 24; });
    $("dr-sum").textContent = x.sum(bajar, jami);
    $("dr-bar").style.width = Math.round(100 * bajar / (jami || 1)) + "%";
    $("dr-note").textContent = x.note;
    box.innerHTML = "";
    DR_FANLAR.forEach(function (f) {
      var st = drData && drData[f.id];
      var tugadi = st && st.level >= st.total;
      var card = drEl("button", "dr-card" + (f.on ? "" : " soon") + (tugadi ? " done" : ""));
      card.type = "button";
      card.style.setProperty("--dr-rgb", f.rgb);
      var im = drEl("span", "dr-im");
      var img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.onerror = function () { im.classList.add("bosh"); im.textContent = f.nom[lang].charAt(0); };
      img.src = drImg(f.id);
      im.appendChild(img);
      card.appendChild(im);
      var tx = drEl("span", "dr-tx");
      tx.appendChild(drEl("b", "", f.nom[lang]));
      tx.appendChild(drEl("small", "dr-ust", f.ust[lang]));
      if (f.on && f.izoh) { tx.appendChild(drEl("small", "dr-izoh", f.izoh[lang])); }
      if (f.on && st) {
        var pr = drEl("span", "dr-prog");
        var pi = drEl("i");
        pi.style.width = Math.round(100 * st.level / st.total) + "%";
        pr.appendChild(pi);
        tx.appendChild(pr);
      }
      card.appendChild(tx);
      var chip = drEl("span", "dr-chip", !f.on ? x.soon : (st ? st.level + " / " + st.total : ""));
      card.appendChild(chip);
      card.addEventListener("click", function () {
        if (!f.on) { showToast(x.soon + ": " + f.nom[lang]); return; }
        fanOpen(f.id);
      });
      box.appendChild(card);
    });

  }

  /* --- «Bellashuv» bo'limi (egasi, 2026-10-07): Xogvarts bosh sahifasida shaxmat o'rnida. Ball shu yerda:
         fanlar bellashuvlari + sehrgarlar shaxmati. Darslar sahifasida bellashuv ko'rsatilmaydi. --- */
  var blQayt = false;
  var blhMode = "bell";      // "bell" - fanlar bellashuvi + shaxmat; "rek" - rekordlar (bosh sahifadagi alohida katak)
  var blKel = "list", rekKel = "list", qrKel = "fan", qobKel = "dars";   // qayerdan ochilgan: "ortga" o'sha yerga

  function rekHomeOpen() { blHomeOpen("rek"); }
  function blHomeOpen(mode) {
    blhMode = mode === "rek" ? "rek" : "bell";
    blQayt = false;
    ["scr-hub", "scr-cat", "scr-cup", "scr-dars", "scr-fan", "scr-afsun", "scr-iksir", "scr-tarix", "scr-himoya", "scr-uchish", "scr-maxluq", "scr-qoriq", "scr-issiq", "scr-duel", "scr-astro", "scr-osimlik", "scr-trans", "scr-qob", "scr-rek", "scr-bell", "scr-sq",
     "scr-chess-hub", "scr-chess-stats", "pm"].forEach(function (id) { var el = $(id); if (el) { el.classList.add("hidden"); } });
    $("scr-blh").classList.remove("hidden");
    rekFan = null;
    blHomeRender();
    drPost({}, function (res) { if (res && res.ok) { drData = res.lessons || drData; if (!$("scr-blh").classList.contains("hidden")) { blHomeRender(); } } });
    rekLoad(function () { if (!$("scr-blh").classList.contains("hidden")) { blHomeRender(); } });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Shaxmatdan "ortga" - bellashuv bo'limiga
  function blHomeBack() {
    if (!blQayt) { return false; }
    blQayt = false;
    blHomeOpen();
    return true;
  }

  function blHomeRender() {
    var x = drX(), bb = $("blh-list");
    $("blh-kick").textContent = x.kick;
    $("blh-ttl").textContent = blhMode === "rek" ? x.rekSec : x.blTile;
    $("blh-note").textContent = blhMode === "rek" ? x.rekHomeS : x.blHomeS;
    bb.innerHTML = "";
    if (blhMode === "rek") { blhRekList(bb, x); return; }
    DR_FANLAR.forEach(function (f) {
      var c = f.on && drData && drData[f.id] && drData[f.id].contest;
      if (!c) { return; }
      var card = drEl("button", "dr-card" + (c.tries ? " done" : ""));
      card.type = "button";
      card.style.setProperty("--dr-rgb", f.rgb);
      var im = drEl("span", "dr-im");
      var img = document.createElement("img");
      img.alt = "";
      img.src = drImg(f.id);
      im.appendChild(img);
      card.appendChild(im);
      var tx = drEl("span", "dr-tx");
      tx.appendChild(drEl("b", "", f.nom[lang]));
      tx.appendChild(drEl("small", "dr-ust", drItemName(f.id, c.item)));
      tx.appendChild(drEl("small", "dr-izoh", c.ms ? x.sec(c.ms) + " · " + x.place(c.place, c.n) : x.bellNone));
      card.appendChild(tx);
      card.appendChild(drEl("span", "dr-chip", "+" + c.prizes.top[0]));
      card.addEventListener("click", function () { blOpen(f.id, "list"); });
      bb.appendChild(card);
    });
  }
  // Rekordlar ro'yxati: xatosiz kim uzoqqa boradi (egasi g'oyasi, 2026-10-08; alohida bo'lim - 2026-10-09)
  function blhRekList(bb, x) {
    DR_FANLAR.forEach(function (f) {
      if (!f.on) { return; }
      var r = rekData && rekData[f.id], card = drEl("button", "dr-card"), im = drEl("span", "dr-im"), img = document.createElement("img");
      card.type = "button";
      card.style.setProperty("--dr-rgb", f.rgb);
      img.alt = ""; img.src = drImg(f.id);
      im.appendChild(img);
      card.appendChild(im);
      var tx = drEl("span", "dr-tx");
      tx.appendChild(drEl("b", "", f.nom[lang]));
      tx.appendChild(drEl("small", "dr-izoh", x.rekCard(r ? r.all : 0) + (r && r.all ? " " + rekBir(f.id) : "")));
      card.appendChild(tx);
      if (r && r.top && r.top[0]) { card.appendChild(drEl("span", "dr-chip", String(r.top[0].score))); }
      card.addEventListener("click", function () { rekOpen(f.id, "list"); });
      bb.appendChild(card);
    });
  }

  /* ================= REKORD: xatosiz kim uzoqqa boradi (egasi g'oyasi, 2026-10-08) =================
     Kunlik bellashuv - kim TEZ; rekord - kim UZOQ: har fanda cheksiz rejim, birinchi xatoda tugaydi, natija - nechta
     qadam o'tilgani. Darslarni tugatganlar ham zerikmasin. Server: {record: fan, score}, {records: 1} (hpdars.dars_rekord,
     jadval DOIMIY - egasi qarori). Hozircha BALL BERILMAYDI. Har o'yinda `rek` bayrog'i:
     tezlik/qiyinlik qadam sayin oshadi (har o'yinning Open funksiyasiga "rek" beriladi). */
  var rekData = null, rekFan = null, rekAt = 0, rekSahifa = null;
  var REK_BIR = { tarix: ["savol", "вопросов", "questions"], afsun: ["afsun", "заклинаний", "spells"], iksir: ["masalliq", "ингредиентов", "ingredients"],
                  himoya: ["xavf", "опасностей", "dangers"], uchish: ["halqa", "колец", "hoops"], maxluq: ["juftlik", "пар", "pairs"],
                  astro: ["turkum", "созвездий", "constellations"], osimlik: ["parvarish", "растений", "plants"], trans: ["savol", "вопросов", "questions"] };
  function rekBir(f) { return (REK_BIR[f] || ["", "", ""])[lang === "ru" ? 1 : lang === "en" ? 2 : 0]; }
  function rekLoad(cb) {
    if (Date.now() - rekAt < 30000 && rekData) { if (cb) { cb(); } return; }
    rekAt = Date.now();
    drPost({ records: 1 }, function (res) { if (res && res.records) { rekData = res.records; } if (cb) { cb(); } });
  }
  function rekOpen(fan, kel) {
    if (kel) { rekKel = kel; }
    rekFan = null;
    rekSahifa = fan;
    drShowGame("scr-rek");
    rekRender();
    rekAt = 0;
    rekLoad(function () { if (rekSahifa === fan && !$("scr-rek").classList.contains("hidden")) { rekRender(); } });
  }
  function rekRender() {
    var x = drX(), f = drFan(rekSahifa), r = (rekData && rekData[rekSahifa]) || { week: 0, all: 0, top: [], n: 0, place: null };
    $("scr-rek").style.setProperty("--dr-rgb", f.rgb);
    $("rk-kick").textContent = x.rekT;
    $("rk-ttl").textContent = f.nom[lang];
    $("rk-ttl").classList.toggle("uzun", f.nom[lang].length > 18);
    $("rk-im").src = drImg(f.id);
    $("rk-rule").textContent = x.rekRule + " " + x.rekPrize(r.prizes || [5, 3, 2]);
    $("rk-week").textContent = r.place ? String(r.place) : "—";
    $("rk-week-t").textContent = x.rekWeek + (r.place ? " · " + x.rekPlace(r.place, r.n) : "");
    $("rk-all").textContent = String(r.all);
    $("rk-all-t").textContent = x.rekAll + " · " + rekBir(f.id);
    $("rk-go").textContent = x.rekGo;
    $("rk-top-t").textContent = x.rekTop;
    var box = $("rk-top");
    box.innerHTML = "";
    if (!r.top.length) { box.appendChild(drEl("p", "rk-bosh", x.rekEmpty)); return; }
    r.top.forEach(function (p, i) {
      var row = drEl("div", "bl-row" + (p.me ? " me" : ""));
      row.appendChild(drEl("i", "o" + (i + 1), String(i + 1)));
      var cr = drEl("span", "bl-cr"), im = cupCrestImg(p.house, 18);
      if (im) { cr.appendChild(im); }
      row.appendChild(cr);
      row.appendChild(drEl("b", "", p.name + (p.me ? " (" + x.you + ")" : "")));
      row.appendChild(drEl("em", "", String(p.score)));
      box.appendChild(odamLink(row, p));
    });
  }
  function rekBosh(fan) {
    rekFan = fan;
    drPost({ rek_start: fan }, function () {});       // urinish serverda boshlanadi - natija shu vaqtga sig'ishi kerak
    if (fan === "tarix") { trRek(); } else if (fan === "afsun") { afOpen("rek"); } else if (fan === "iksir") { ikOpen("rek"); }
    else if (fan === "himoya") { hmOpen("rek"); } else if (fan === "uchish") { uchOpen("rek"); } else if (fan === "maxluq") { mxOpen("rek"); }
    else if (fan === "astro") { ylOpen("rek"); } else if (fan === "osimlik") { osOpen("rek"); } else if (fan === "trans") { tfOpen("rek"); }
  }
  function rekQayt() { var f = rekFan; rekFan = null; rekOpen(f); }
  // O'yin tugadi: natija paneli (o'yinning o'z natija qutisiga) va serverga yozish
  function rekEnd(fan, score, box) {
    var x = drX(), oldin = rekData && rekData[fan] ? rekData[fan].all : 0, yangi = score > oldin;
    box.innerHTML = "";
    box.appendChild(drEl("small", "af-baho-k", x.rekRes + " · " + drFan(fan).nom[lang]));
    box.appendChild(drEl("b", "rk-son", String(score)));
    box.appendChild(drEl("small", "dr-res-s", rekBir(fan)));
    box.appendChild(drEl(yangi && score > 0 ? "b" : "small", yangi && score > 0 ? "dr-res-p" : "dr-res-s", yangi && score > 0 ? x.rekNew : x.rekOld(oldin)));
    var r = drEl("button", "dr-btn", x.rekAgain);
    r.type = "button";
    r.addEventListener("click", function () { rekBosh(fan); });
    box.appendChild(r);
    var b = drEl("button", "dr-btn ikkinchi", x.rekBack);
    b.type = "button";
    b.addEventListener("click", function () { rekOpen(fan); });
    box.appendChild(b);
    box.classList.remove("hidden");
    if (yangi && score > 0) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {} }
    if (score > 0) { drPost({ record: fan, score: score }, function (res) { if (res && res.records) { rekData = rekData || {}; rekData[fan] = res.records[fan]; } }); }
  }

  var DR_KUBOK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3h10v2h3v3a4 4 0 0 1-3.6 4A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 7.6 12 4 4 0 0 1 4 8V5h3zm10 4v2.8A2 2 0 0 0 18 8V7zM6 7v1a2 2 0 0 0 1 1.8V7z"/></svg>';
  function drItemName(fan, item) {
    if (fan === "afsun") { return ((AF[item] || {})[lang] || (AF[item] || {}).uz || [item])[0]; }
    if (fan === "iksir") { return (IK[item] || {})[lang] || (IK[item] || {}).uz || item; }
    if (fan === "tarix") { return drX().tarixItem(parseInt(item, 10) || 10); }
    return item;
  }

  /* --- bellashuv sahifasi --- */
  var blFan = null, bl = null;       // bl: ketayotgan urinish {fan, t0, xato}

  function blOpen(fan, kel) {
    if (kel) { blKel = kel; }
    blFan = fan;
    bl = null;
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-fan", "scr-tarix", "scr-himoya", "scr-uchish", "scr-maxluq", "scr-qoriq", "scr-issiq", "scr-duel", "scr-astro", "scr-osimlik", "scr-trans", "scr-qob", "scr-rek", "scr-blh", "scr-hub", "scr-sq"].forEach(function (id) { $(id).classList.add("hidden"); });
    $("scr-bell").classList.remove("hidden");
    blRender();
    drPost({}, function (res) { if (res && res.ok) { drData = res.lessons || drData; if (!$("scr-bell").classList.contains("hidden")) { blRender(); } } });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function blRow(p, i, x) {
    var r = drEl("div", "bl-row" + (p.me ? " me" : ""));
    r.appendChild(drEl("i", "o" + (i + 1), String(i + 1)));
    var cr = drEl("span", "bl-cr");
    var im = cupCrestImg(p.house, 18);
    if (im) { cr.appendChild(im); }
    r.appendChild(cr);
    r.appendChild(drEl("b", "", p.name + (p.me && !p.nom ? " (" + x.you + ")" : "")));
    r.appendChild(drEl("em", "", x.sec(p.ms)));
    return odamLink(r, p);
  }

  // Kun tugashiga qancha qoldi (Toshkent vaqti, UTC+5) - bellashuv yarim tunda yakunlanadi
  function blLeft() {
    var tk = Date.now() + 5 * 3600000, ms = 86400000 - (tk % 86400000);
    return [Math.floor(ms / 3600000), Math.floor((ms % 3600000) / 60000)];
  }

  // Shohsupa ustuni (birinchi uchlik)
  function blPod(p, orin, x) {
    var c = drEl("div", "bl-pd p" + orin + (p && p.me ? " me" : "") + (p ? "" : " bosh"));
    c.appendChild(drEl("i", "bl-pd-n", String(orin)));
    var cr = drEl("span", "bl-pd-cr");
    var im = p ? cupCrestImg(p.house, 0) : null;
    if (im) { cr.appendChild(im); }
    c.appendChild(cr);
    c.appendChild(drEl("b", "", p ? p.name : "—"));
    c.appendChild(drEl("em", "", p ? x.sec(p.ms) : ""));
    c.appendChild(drEl("span", "bl-pd-st"));
    return p ? odamLink(c, p) : c;
  }

  function blRender() {
    var x = drX(), f = drFan(blFan), st = drData && drData[blFan], c = st && st.contest;
    if (!f || !c) { return; }
    $("scr-bell").style.setProperty("--dr-rgb", f.rgb);
    $("bl-kick").textContent = x.bell;
    $("bl-ttl").textContent = f.nom[lang];
    $("bl-im").src = drImg(f.id);
    $("bl-today").textContent = x.today;
    $("bl-name").textContent = drItemName(blFan, c.item);
    var lf = blLeft();
    $("bl-left").textContent = x.leftT(lf[0], lf[1]);

    // Sovrinlar: to'rtta medal
    var pz = $("bl-prizes");
    pz.innerHTML = "";
    [["1", c.prizes.top[0], "o1"], ["2", c.prizes.top[1], "o2"], ["3", c.prizes.top[2], "o3"], ["4–10", c.prizes.ten, "o4"]].forEach(function (q) {
      var d = drEl("span", "bl-pz " + q[2]);
      d.appendChild(drEl("i", "", q[0]));
      d.appendChild(drEl("b", "", "+" + q[1]));
      d.appendChild(drEl("small", "", x.ptsW));
      pz.appendChild(d);
    });

    // O'z natijasi va urinishlar
    var qoldi = Math.max(0, (c.max || 3) - (c.tries || 0));
    $("bl-me").classList.toggle("bor", !!c.ms);
    $("bl-me-k").textContent = c.ms ? x.meBest : x.meK;
    $("bl-me-t").textContent = c.ms ? x.sec(c.ms) : x.bellNone;
    $("bl-me-p").textContent = c.ms ? x.place(c.place, c.n) : "";
    var dots = $("bl-dots");
    dots.innerHTML = "";
    for (var k = 0; k < (c.max || 3); k++) { dots.appendChild(drEl("i", k < (c.tries || 0) ? "on" : "")); }
    $("bl-dots-l").textContent = qoldi > 0 ? x.tries(qoldi) : x.bellNo;
    var go = $("bl-go");
    go.textContent = qoldi > 0 ? x.bellGo : x.bellNo;
    go.disabled = qoldi < 1;
    $("bl-rule").textContent = x.rule;

    // Jadval: birinchi uchlik shohsupada, qolganlari ro'yxatda
    $("bl-top-t").textContent = x.topT + (c.n ? " · " + c.n : "");
    var pod = $("bl-pod"), top = $("bl-top");
    pod.innerHTML = "";
    top.innerHTML = "";
    pod.classList.toggle("hidden", !c.top.length);
    if (!c.top.length) { top.appendChild(drEl("p", "bl-none", x.topNone)); }
    else {
      [2, 1, 3].forEach(function (o) { pod.appendChild(blPod(c.top[o - 1] || null, o, x)); });
      c.top.slice(3).forEach(function (p, i) { top.appendChild(blRow(p, i + 3, x)); });
      // O'zi o'ntalikdan pastda bo'lsa - alohida qator
      if (c.ms && c.place > c.top.length) {
        top.appendChild(blRow({ name: x.you, house: (cupMe() || {}).house, ms: c.ms, me: true, nom: true }, c.place - 1, x));
      }
    }
    var y = c.yesterday || { top: [] };
    $("bl-yest-h").classList.toggle("hidden", !y.top.length);
    $("bl-yest-t").textContent = x.yest;
    var yb = $("bl-yest");
    yb.innerHTML = "";
    y.top.forEach(function (p, i) { yb.appendChild(blRow(p, i, x)); });
    if (y.place) { yb.appendChild(drEl("p", "bl-none", x.yestMe(y.place, y.pts))); }
  }

  // Urinishni boshlash: avval server (vaqtni u o'lchaydi), keyin o'yin
  function blStart() {
    if (drBusy || !blFan) { return; }
    drBusy = true;
    var fan = blFan;
    drPost({ start: fan, lang: lang }, function (res) {
      drBusy = false;
      if (res && res.lessons) { drData = res.lessons; }
      if (!res || !res.ok) { showToast(res && res.error === "no_tries" ? drX().bellNo : drX().fail, res && res.error === "no_tries" ? "" : "err"); blRender(); return; }
      bl = { fan: fan, t0: Date.now(), xato: 0, answers: [] };
      if (fan === "afsun") { afOpen(true); } else if (fan === "iksir") { ikOpen(true); } else if (fan === "himoya") { hmOpen(true); } else if (fan === "uchish") { uchOpen(true); } else if (fan === "maxluq") { mxOpen(true); } else if (fan === "astro") { ylOpen(true); } else if (fan === "osimlik") { osOpen(true); } else if (fan === "trans") { tfOpen(true); } else { trStart(res.questions || [], true, 0); }
      blTick();
    });
  }

  function blTick() {
    if (!bl) { return; }
    if (bl.fan === "iksir") { $("ik-timer").textContent = drX().timer + " · " + drX().sec(Date.now() - bl.t0 + bl.xato * 3000); }
    else if (bl.fan === "tarix") { $("tr-timer").textContent = drX().timer + " · " + drX().sec(Date.now() - bl.t0); }
    else if (af && !af.done) { afPaint(); }
    bl.tm = setTimeout(blTick, 100);
  }

  // Urinish tugadi: natija serverda hisoblanadi
  function blFinish(box) {
    var x = drX(), b = bl;
    if (!b) { return; }
    bl = null;
    clearTimeout(b.tm);
    drPost({ finish: b.fan, xato: b.xato, answers: b.answers }, function (res) {
      if (res && res.lessons) { drData = res.lessons; }
      box.innerHTML = "";
      if (!res || !res.ok) { box.appendChild(drEl("p", "dr-res-t", x.fail)); }
      else {
        var c = drData[b.fan].contest;
        box.appendChild(drEl("p", "dr-res-t", x.resT(x.sec(res.ms))));
        if (b.fan === "tarix" && typeof res.wrong === "number") { box.appendChild(drEl("small", "dr-res-s", x.trRes(b.answers.length - res.wrong, b.answers.length))); }
        box.appendChild(drEl("b", "dr-res-p", x.place(c.place, c.n)));
        if (res.best < res.ms) { box.appendChild(drEl("small", "dr-res-s", x.resBest(x.sec(res.best)))); }
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
      }
      var bt = drEl("button", "dr-btn", x.bellBack);
      bt.type = "button";
      bt.addEventListener("click", function () { blOpen(b.fan); });
      box.appendChild(bt);
      box.classList.remove("hidden");
    });
  }

  // Bellashuv paytida o'yindan chiqib ketilsa urinish yonadi (server vaqti o'tib ketadi)
  function blAbort() { if (bl) { clearTimeout(bl.tm); bl = null; } }

  /* --- fan sahifasi: darslar to'ri (bosqichlar) va shu fanning bellashuvi --- */
  var fanId = null;

  function fanOpen(id) {
    fanId = id;
    qrLoad();
    drQayt = false;
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-bell", "scr-tarix", "scr-himoya", "scr-uchish", "scr-maxluq", "scr-qoriq", "scr-issiq", "scr-duel", "scr-astro", "scr-osimlik", "scr-trans", "scr-qob", "scr-rek", "scr-blh", "scr-hub", "scr-quiz", "scr-tasks"].forEach(function (q) { $(q).classList.add("hidden"); });
    $("scr-fan").classList.remove("hidden");
    fanRender();
    rekLoad(function () { if (fanId === id && !$("scr-fan").classList.contains("hidden")) { fanMore(); } });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function fanRender() {
    var x = drX(), f = drFan(fanId), st = drData && drData[fanId];
    if (!f) { return; }
    $("fn-kick").textContent = f.ust[lang];
    $("fn-ttl").textContent = f.nom[lang];
    $("fn-ttl").classList.toggle("uzun", f.nom[lang].length > 18);
    var qb = $("fn-qr");
    if (qb) {
      qb.classList.toggle("hidden", fanId !== "maxluq" && fanId !== "osimlik");
      qb.classList.toggle("is", fanId === "osimlik");
      if (fanId === "osimlik") {      // O'simlikshunoslik: Issiqxonaga yo'l (js/09-issiqxona.js)
        $("fn-qr-im").src = isImg("mandragora", 2);
        $("fn-qr-t").textContent = isX().ttl;
        $("fn-qr-s").textContent = isX().fanS(Math.min(12, Math.floor((st ? st.level : 0) / 3)));
      } else { $("fn-qr-im").src = qrImg("gippo", 2); }
      if (fanId === "maxluq") { $("fn-qr-t").textContent = x.qrT; $("fn-qr-s").textContent = x.qrOpenS(Math.min(11, Math.floor((st ? st.level : 0) / 3))); }
    }
    fanMore();
    var im = $("fn-im");
    im.src = drImg(f.id);
    $("scr-fan").style.setProperty("--dr-rgb", f.rgb);
    var lv = st ? st.level : 0, jami = st ? st.total : 24;
    $("fn-sum").textContent = lv >= jami ? x.allDone : x.of(lv, jami);
    $("fn-bar").style.width = Math.round(100 * lv / jami) + "%";
    $("fn-les-t").textContent = x.lessons;
    $("fn-les-s").textContent = x.lessonsS;
    var grid = $("fn-grid");
    grid.innerHTML = "";
    for (var n = 1; n <= jami; n++) {
      (function (k) {
        var b = drEl("button", "fn-l" + (k <= lv ? " done" : k === lv + 1 ? " now" : " lock"), String(k));
        if (DR_BAHO_K[fanId] && k <= lv && drBahoGet(fanId, k) >= 4) { b.classList.add("bh" + drBahoGet(fanId, k)); }
        b.type = "button";
        b.addEventListener("click", function () {
          if (k > lv + 1) { showToast(x.locked); return; }
          fanLevel(fanId, k);
        });
        grid.appendChild(b);
      })(n);
    }
  }

  // Fan sahifasidagi ikki katak: shu fanning bugungi bellashuvi va rekordi (egasi, 2026-10-09: «matritsa» navigatsiya)
  function fanMore() {
    var x = drX(), box = $("fn-more"), st = drData && drData[fanId], c = st && st.contest, r = rekData && rekData[fanId];
    if (!box) { return; }
    box.innerHTML = "";
    var mk = function (kick, ttl, sub, chip, go) {
      var b = drEl("button", "fn-mc");
      b.type = "button";
      b.appendChild(drEl("small", "", kick));
      b.appendChild(drEl("b", "", ttl));
      b.appendChild(drEl("span", "", sub));
      if (chip) { b.appendChild(drEl("em", "", chip)); }
      b.addEventListener("click", go);
      box.appendChild(b);
    };
    var id = fanId;
    if (c) {
      mk(x.blTile, id === "afsun" || id === "iksir" || id === "tarix" ? drItemName(id, c.item) : x.fnBell, c.ms ? x.sec(c.ms) + " · " + x.place(c.place, c.n) : x.bellNone, "+" + c.prizes.top[0], function () { blOpen(id, "fan"); });
    }
    mk(x.rekSec, r && r.all ? r.all + " " + rekBir(id) : x.rekGo, r && r.place ? x.rekWeek + ": " + r.place : x.rekTileS, r && r.top && r.top[0] ? String(r.top[0].score) : "", function () { rekOpen(id, "fan"); });
  }

  // Qo'riqxona - Xogvarts bosh sahifasidagi katak (egasi, 2026-10-09: profilda emas)
  function qrHubOpen() { qrKel = "hub"; qrOpen(); }
  function qrSoni() {
    var n = 0;
    try { ((qrData && qrData.list) || []).forEach(function (m) { if (m.got) { n++; } }); } catch (e) {}
    return n;
  }

  // Profil sahifasidagi qator: Qobiliyatlar
  function pmDarsRows() {
    var x = drX(), ichkarida = false;
    try { ichkarida = hasHouse(); } catch (e) {}
    var b = $("pm-qob");
    if (!b) { return; }
    b.classList.toggle("hidden", !ichkarida);
    if (!ichkarida) { return; }
    $("pm-qob-t").textContent = x.qobBtn;
    $("pm-qob-s").textContent = x.qobBtnS;
    b.onclick = function () { qobKel = "pm"; $("pm").classList.add("hidden"); qobOpen(); };
  }

  // N-darsni ochish
  function fanLevel(id, n) {
    if (id === "afsun") { afOpen(false, n); }
    else if (id === "iksir") { ikOpen(false, n); }
    else if (id === "tarix") { trOpen(n); }
    else if (id === "himoya") { hmOpen(false, n); }
    else if (id === "uchish") { uchOpen(false, n); }
    else if (id === "maxluq") { mxOpen(false, n); }
    else if (id === "astro") { ylOpen(false, n); }
    else if (id === "osimlik") { osOpen(false, n); }
    else if (id === "trans") { tfOpen(false, n); }
  }

  // Dars o'tildi: bosqich serverda oshadi (faqat navbatdagi dars). Ball berilmaydi. cb(yangi: true/false/null)
  function drDone(id, level, cb) {
    if (drBusy) { return; }
    drBusy = true;
    var so = { done: id, level: level };
    if (drBahoOx && drBahoOx.fan === id && drBahoOx.n === level) { so.grade = drBahoOx.b; }
    drPost(so, function (res) {
      drBusy = false;
      if (!res || !res.ok) { showToast(drX().fail, "err"); cb(null); return; }
      drData = res.lessons || drData;
      if (res["new"]) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {} }
      if (res["new"] && id === "osimlik" && level % 3 === 0) { try { isSeed(level); } catch (e) {} }      // yangi urug' - Issiqxonaga
      cb(!!res["new"]);
    });
  }

  function drShowGame(scr) {
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-bell", "scr-blh", "scr-fan", "scr-tarix", "scr-himoya", "scr-uchish", "scr-maxluq", "scr-qoriq", "scr-issiq", "scr-duel", "scr-astro", "scr-osimlik", "scr-trans", "scr-qob", "scr-rek"].forEach(function (id) { $(id).classList.toggle("hidden", id !== scr); });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Dars oxiridagi natija paneli (hamma o'yinda bir xil): keyingi dars yoki ro'yxatga qaytish
  function drResult(box, matn, fan, level, yangi) {
    var x = drX(), st = drData && drData[fan];
    box.innerHTML = "";
    box.appendChild(drEl("p", "dr-res-t", matn));
    if (yangi === true) { box.appendChild(drEl("b", "dr-res-p", x.passed(level))); }
    else if (yangi === false) { box.appendChild(drEl("small", "dr-res-s", x.again2)); }
    if (st && level < st.total && level <= st.level) {
      var nx = drEl("button", "dr-btn", x.next + " · " + x.lvl(level + 1));
      nx.type = "button";
      nx.addEventListener("click", function () { fanLevel(fan, level + 1); });
      box.appendChild(nx);
    }
    var b = drEl("button", "dr-btn ikkinchi", x.toList);
    b.type = "button";
    b.addEventListener("click", function () { fanOpen(fan); });
    box.appendChild(b);
    box.classList.remove("hidden");
  }

  /* ================= SEHRGARLIK TARIXI: savol-javob =================
     Dars: 6 yangi + 2 takror savol (soni serverdan), javob darhol tekshiriladi (to'g'risi yashil); dars faqat
     HAMMA savolga to'g'ri javob berilsa o'tadi (egasi, 2026-10-08).
     Bellashuv: 10 savol, to'g'ri javob ko'rsatilmaydi - javoblar serverga ketadi, u tekshiradi. */
  var tr = null;      // {qs, i, ok, bell, level, need, lock}

  function trOpen(n) {
    drShowGame("scr-tarix");
    var x = drX(), f = drFan("tarix");
    $("tr-kick").textContent = f.nom[lang];
    $("tr-ttl").textContent = x.lvl(n);
    $("tr-timer").classList.add("hidden");
    $("tr-res").classList.add("hidden");
    $("tr-q").textContent = x.loadQ;
    $("tr-step").textContent = "";
    $("tr-opts").innerHTML = "";
    tr = null;
    drPost({ quiz: n, lang: lang }, function (res) {
      if ($("scr-tarix").classList.contains("hidden")) { return; }
      if (!res || !res.ok || !res.questions || !res.questions.length) { showToast(res && res.error === "locked" ? x.locked : x.fail, "err"); fanOpen("tarix"); return; }
      trStart(res.questions, false, n, res.need);
    });
  }

  // Rekord: tasodifiy savollar, birinchi xatoda tugaydi
  function trRek() {
    var x = drX();
    drShowGame("scr-tarix");
    $("tr-kick").textContent = drFan("tarix").nom[lang];
    $("tr-ttl").textContent = x.rekT;
    $("tr-timer").classList.add("hidden");
    $("tr-res").classList.add("hidden");
    $("tr-q").textContent = x.loadQ;
    $("tr-step").textContent = "";
    $("tr-opts").innerHTML = "";
    tr = null;
    drPost({ quiz_rek: 1, lang: lang }, function (res) {
      if ($("scr-tarix").classList.contains("hidden")) { return; }
      if (!res || !res.ok || !res.questions || !res.questions.length) { showToast(x.fail, "err"); rekQayt(); return; }
      trStart(res.questions, false, 0, 0, true);
    });
  }
  function trStart(qs, bell, level, need, rek) {
    var x = drX();
    tr = { qs: qs, i: 0, ok: 0, bell: !!bell, rek: !!rek, level: level, need: need || qs.length, lock: false };
    if (qrYordam(["kalamush"], bell || rek).kalamush) { tr.need = Math.max(1, tr.need - 1); }
    if (bell) {
      drShowGame("scr-tarix");
      $("tr-kick").textContent = x.bell;
      $("tr-ttl").textContent = drFan("tarix").nom[lang];
      $("tr-res").classList.add("hidden");
    }
    $("tr-timer").classList.toggle("hidden", !bell);
    $("tr-stage").classList.remove("hidden");
    trPaint();
  }

  function trPaint() {
    if (!tr) { return; }
    var x = drX(), q = tr.qs[tr.i], box = $("tr-opts");
    $("tr-step").textContent = x.trQ(tr.i + 1, tr.qs.length);
    $("tr-q").textContent = q.q;
    box.innerHTML = "";
    q.a.forEach(function (matn, k) {
      var b = drEl("button", "tr-o", matn);
      b.type = "button";
      b.addEventListener("click", function () { trPick(k, b); });
      box.appendChild(b);
    });
  }

  function trPick(k, btn) {
    if (!tr || tr.lock) { return; }
    var q = tr.qs[tr.i], kut = 220;
    tr.lock = true;
    if (tr.bell) {
      if (bl) { bl.answers.push(k); }
      btn.classList.add("tanlandi");
    } else {
      var togri = k === q.c;
      if (togri) { tr.ok++; } else { tr.xato = true; }
      btn.classList.add(togri ? "togri" : "xato");
      if (!togri) { var t = $("tr-opts").children[q.c]; if (t) { t.classList.add("togri"); } }
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(togri ? "success" : "error"); } } catch (e) {}
      kut = togri ? 650 : 1300;
    }
    setTimeout(function () {
      if (!tr) { return; }
      if (tr.rek && (tr.xato || tr.i + 1 >= tr.qs.length)) {
        var tsc = tr.ok;
        tr = null;
        $("tr-stage").classList.add("hidden");
        rekEnd("tarix", tsc, $("tr-res"));
        return;
      }
      tr.lock = false;
      tr.i++;
      if (tr.i < tr.qs.length) { trPaint(); return; }
      trEnd();
    }, kut);
  }

  function trEnd() {
    var x = drX(), t = tr, box = $("tr-res");
    $("tr-stage").classList.add("hidden");
    if (t.bell) { tr = null; blFinish(box); return; }
    var natija = x.trRes(t.ok, t.qs.length);
    if (t.ok >= t.need) {
      drDone("tarix", t.level, function (yangi) { drResult(box, natija, "tarix", t.level, yangi); });
      return;
    }
    box.innerHTML = "";
    box.appendChild(drEl("p", "dr-res-t", natija));
    box.appendChild(drEl("small", "dr-res-s", x.trFail(t.need, t.qs.length)));
    var r = drEl("button", "dr-btn", x.retry);
    r.type = "button";
    r.addEventListener("click", function () { trOpen(t.level); });
    box.appendChild(r);
    var b = drEl("button", "dr-btn ikkinchi", x.toList);
    b.type = "button";
    b.addEventListener("click", function () { fanOpen("tarix"); });
    box.appendChild(b);
    box.classList.remove("hidden");
  }

  /* ================= AFSUNLAR: tayoqcha harakatini chizish =================
     Shakl 0..1 kvadrat ichidagi nuqtalar. Uch urinish: chiziq ko'rinadi -> xira -> yoddan. */
  function afArc(cx, cy, r, a0, a1, n) {
    var p = [];
    for (var i = 0; i <= n; i++) { var a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return p;
  }
  function afWave() { var p = []; for (var i = 0; i <= 24; i++) { var t = i / 24; p.push([0.12 + 0.76 * t, 0.5 - 0.2 * Math.sin(t * Math.PI * 3)]); } return p; }
  function afSpiral() {
    var p = [];
    for (var i = 0; i <= 40; i++) { var t = i / 40, a = -Math.PI / 2 + t * Math.PI * 3.5, r = 0.08 + 0.3 * t; p.push([0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)]); }
    return p;
  }
  function afSakkiz() {
    var p = [];
    for (var i = 0; i <= 40; i++) { var t = i / 40 * Math.PI * 2; p.push([0.5 + 0.32 * Math.sin(t), 0.5 + 0.2 * Math.sin(2 * t)]); }
    return p;
  }
  var AF = {
    lumos:        { s: [[0.2, 0.8], [0.5, 0.18], [0.8, 0.8]],
                    uz: ["Lumos", "Tayoqcha uchida yorug'lik yoqadi."], ru: ["Люмос", "Зажигает свет на кончике палочки."], en: ["Lumos", "Lights the tip of the wand."] },
    leviosa:      { s: [[0.14, 0.34], [0.22, 0.52], [0.36, 0.62], [0.52, 0.6], [0.66, 0.5], [0.76, 0.34], [0.84, 0.14]],
                    uz: ["Vingardium Leviosa", "Buyumni havoga ko'taradi. «Silkitib, keyin siltang!»"], ru: ["Вингардиум Левиоса", "Поднимает предмет в воздух. «Взмахнуть и рассечь!»"], en: ["Wingardium Leviosa", "Makes an object fly. “Swish and flick!”"] },
    alohomora:    { s: [[0.72, 0.2], [0.5, 0.16], [0.32, 0.26], [0.34, 0.42], [0.5, 0.5], [0.66, 0.58], [0.68, 0.74], [0.5, 0.84], [0.28, 0.8]],
                    uz: ["Aloxomora", "Qulflangan eshikni ochadi."], ru: ["Алохомора", "Открывает запертую дверь."], en: ["Alohomora", "Opens a locked door."] },
    expelliarmus: { s: [[0.2, 0.25], [0.78, 0.25], [0.26, 0.62], [0.82, 0.62]],
                    uz: ["Ekspelliarmus", "Raqibning qo'lidan tayoqchasini uchirib yuboradi."], ru: ["Экспеллиармус", "Выбивает палочку из рук противника."], en: ["Expelliarmus", "Knocks the wand out of an opponent's hand."] },
    accio:        { s: afArc(0.5, 0.3, 0.36, 0, Math.PI, 20),
                    uz: ["Aksio", "Uzoqdagi buyumni o'ziga chaqiradi."], ru: ["Акцио", "Призывает предмет издалека."], en: ["Accio", "Summons an object from afar."] },
    protego:      { s: [[0.25, 0.22], [0.75, 0.22], [0.75, 0.52], [0.5, 0.86], [0.25, 0.52], [0.25, 0.22]],
                    uz: ["Protego", "Sehrli qalqon hosil qiladi."], ru: ["Протего", "Создаёт магический щит."], en: ["Protego", "Casts a magical shield."] },
    incendio:     { s: [[0.18, 0.3], [0.34, 0.76], [0.5, 0.38], [0.66, 0.76], [0.82, 0.3]],
                    uz: ["Insendio", "Olov yoqadi."], ru: ["Инсендио", "Зажигает огонь."], en: ["Incendio", "Starts a fire."] },
    reparo:       { s: [[0.5, 0.18], [0.82, 0.76], [0.18, 0.76], [0.5, 0.18]],
                    uz: ["Reparo", "Singan buyumni tiklaydi."], ru: ["Репаро", "Чинит сломанную вещь."], en: ["Reparo", "Mends a broken object."] },
    stupefy:      { s: [[0.62, 0.14], [0.34, 0.5], [0.62, 0.5], [0.36, 0.88]],
                    uz: ["Stupefay", "Raqibni karaxt qiladi."], ru: ["Остолбеней", "Оглушает противника."], en: ["Stupefy", "Stuns an opponent."] },
    aguamenti:    { s: afWave(),
                    uz: ["Aguamenti", "Tayoqchadan suv oqizadi."], ru: ["Агуаменти", "Вызывает струю воды из палочки."], en: ["Aguamenti", "Shoots water from the wand."] },
    nox:          { s: [[0.2, 0.2], [0.5, 0.82], [0.8, 0.2]],
                    uz: ["Noks", "Tayoqchadagi yorug'likni o'chiradi."], ru: ["Нокс", "Гасит свет на палочке."], en: ["Nox", "Puts out the wand's light."] },
    patronum:     { s: afSpiral(),
                    uz: ["Ekspekto Patronum", "Dementorlardan himoya qiluvchi Patronusni chaqiradi."], ru: ["Экспекто Патронум", "Вызывает Патронуса — защитника от дементоров."], en: ["Expecto Patronum", "Conjures a Patronus against Dementors."] },
    petrificus:   { s: [[0.25, 0.82], [0.25, 0.22], [0.75, 0.22], [0.75, 0.82]],
                    uz: ["Petrifikus Totalus", "Raqibning butun tanasini qotirib qo'yadi."], ru: ["Петрификус Тоталус", "Полностью обездвиживает противника."], en: ["Petrificus Totalus", "Binds the whole body of an opponent."] },
    impedimenta:  { s: [[0.15, 0.3], [0.85, 0.3], [0.85, 0.7], [0.15, 0.7]],
                    uz: ["Impedimenta", "Yaqinlashayotgan raqibni sekinlashtiradi yoki to'xtatadi."], ru: ["Импедимента", "Замедляет или останавливает приближающегося противника."], en: ["Impedimenta", "Slows or stops an approaching attacker."] },
    riddikulus:   { s: afArc(0.5, 0.5, 0.3, -Math.PI / 2, Math.PI * 1.5, 32),
                    uz: ["Ridikulus", "Boggartni kulgili narsaga aylantiradi."], ru: ["Ридикулус", "Превращает боггарта во что-то смешное."], en: ["Riddikulus", "Turns a Boggart into something funny."] },
    finite:       { s: [[0.2, 0.2], [0.8, 0.8]],
                    uz: ["Finite Inkantatem", "Amal qilayotgan afsunlarni to'xtatadi."], ru: ["Фините Инкантатем", "Прекращает действие заклинаний."], en: ["Finite Incantatem", "Ends the effects of spells."] },
    reducto:      { s: [[0.25, 0.2], [0.78, 0.5], [0.25, 0.8]],
                    uz: ["Redukto", "Qattiq to'siqni parcha-parcha qiladi."], ru: ["Редукто", "Разбивает твёрдую преграду на куски."], en: ["Reducto", "Blasts a solid obstacle to pieces."] },
    diffindo:     { s: [[0.18, 0.5], [0.4, 0.78], [0.84, 0.2]],
                    uz: ["Diffindo", "Buyumni kesadi yoki yirtadi."], ru: ["Диффиндо", "Разрезает или разрывает предмет."], en: ["Diffindo", "Cuts or rips an object."] },
    episkey:      { s: afArc(0.5, 0.72, 0.34, Math.PI, Math.PI * 2, 20),
                    uz: ["Episkey", "Yengil jarohatlarni davolaydi."], ru: ["Эпискеи", "Залечивает лёгкие травмы."], en: ["Episkey", "Heals minor injuries."] },
    silencio:     { s: [[0.82, 0.32], [0.2, 0.32], [0.2, 0.74]],
                    uz: ["Silensio", "Ovozni o'chirib qo'yadi."], ru: ["Силенцио", "Лишает голоса."], en: ["Silencio", "Silences its target."] },
    engorgio:     { s: [[0.25, 0.25], [0.75, 0.25], [0.75, 0.75], [0.25, 0.75], [0.25, 0.25]],
                    uz: ["Engorgio", "Buyumni kattalashtiradi."], ru: ["Энгоргио", "Увеличивает предмет."], en: ["Engorgio", "Makes an object grow."] },
    reducio:      { s: [[0.5, 0.15], [0.8, 0.5], [0.5, 0.85], [0.2, 0.5], [0.5, 0.15]],
                    uz: ["Redusio", "Buyumni kichraytiradi."], ru: ["Редуцио", "Уменьшает предмет."], en: ["Reducio", "Makes an object shrink."] },
    colloportus:  { s: afArc(0.5, 0.32, 0.17, Math.PI / 2, Math.PI * 2.5, 24).concat([[0.5, 0.88]]),
                    uz: ["Kolloportus", "Eshikni sehr bilan qulflaydi."], ru: ["Коллопортус", "Запирает дверь волшебством."], en: ["Colloportus", "Magically locks a door."] },
    obliviate:    { s: afSakkiz(),
                    uz: ["Obliviate", "Xotiradan voqeani o'chirib tashlaydi."], ru: ["Обливиэйт", "Стирает событие из памяти."], en: ["Obliviate", "Erases a memory."] }
  };
  // Vaziyatlar (25-36-darslar): afsun nomi aytilmaydi - o'quvchi o'zi topadi
  var AF_VAZ = {
    lumos: ["Yo'lak zim-ziyo, hech narsa ko'rinmayapti.", "В коридоре кромешная тьма, ничего не видно.", "The corridor is pitch-dark; you can't see a thing."],
    leviosa: ["Partadagi patni havoga ko'tarish kerak.", "Нужно поднять перо с парты в воздух.", "You need to make the feather on your desk fly."],
    alohomora: ["Eshik qulflangan, kalit esa yo'q.", "Дверь заперта, а ключа нет.", "The door is locked and there is no key."],
    expelliarmus: ["Raqib tayoqchasini sizga o'qtaldi — uni qurolsizlantiring.", "Противник навёл на вас палочку — обезоружьте его.", "An opponent points a wand at you — disarm them."],
    accio: ["Supurgingiz uzoqda qolib ketdi — uni chaqirish kerak.", "Ваша метла осталась далеко — её нужно призвать.", "Your broom is far away — you need to summon it."],
    protego: ["Sizga qarab afsun uchib kelyapti!", "В вас летит заклинание!", "A spell is flying straight at you!"],
    incendio: ["Kamin o'chib qolgan, xona sovuq.", "Камин погас, в комнате холодно.", "The fire has gone out and the room is cold."],
    reparo: ["Ko'zoynagingiz sinib qoldi.", "Ваши очки разбились.", "Your glasses are broken."],
    stupefy: ["Hujum qilayotgan raqibni karaxt qilish kerak.", "Нужно оглушить нападающего противника.", "You need to stun an attacker."],
    aguamenti: ["Parda yonib ketdi — tezda suv kerak!", "Загорелась штора — срочно нужна вода!", "The curtain is on fire — you need water, fast!"],
    nox: ["Tayoqchangiz yonib turibdi — sizni payqab qolishlari mumkin.", "Ваша палочка светится — вас могут заметить.", "Your wand is lit — you might be spotted."],
    patronum: ["Dementorlar yaqinlashmoqda, havo muzlab ketdi.", "Приближаются дементоры, воздух леденеет.", "Dementors are closing in and the air turns icy."],
    petrificus: ["Kimdir yo'lingizni to'smoqda — uni qimirlamaydigan qilib qo'ying.", "Кто-то преграждает вам путь — обездвижьте его.", "Someone is blocking your way — make them unable to move."],
    impedimenta: ["Sizni quvib kelayotganlarni sekinlashtirish kerak.", "Нужно замедлить тех, кто за вами гонится.", "You need to slow down those chasing you."],
    riddikulus: ["Shkafdan boggart chiqdi va eng katta qo'rquvingizga aylandi.", "Из шкафа вышел боггарт и принял облик вашего главного страха.", "A Boggart leaves the wardrobe and becomes your worst fear."],
    finite: ["Do'stingizning oyoqlari afsundan o'zi raqsga tushyapti — buni to'xtating.", "Ноги вашего друга сами пляшут от заклинания — прекратите это.", "A spell makes your friend's legs dance on their own — stop it."],
    reducto: ["Yo'lni qalin to'siq to'sib qo'ygan — uni parchalash kerak.", "Путь преграждает толстая преграда — её нужно разбить.", "A thick barrier blocks the way — it must be blasted apart."],
    diffindo: ["Sumkangiz bog'ichi tugilib qolgan — uni kesish kerak.", "Ремень сумки затянулся узлом — его нужно разрезать.", "Your bag strap is knotted tight — it needs cutting."],
    episkey: ["Do'stingizning burni qonayapti.", "У вашего друга идёт кровь из носа.", "Your friend's nose is bleeding."],
    silencio: ["Qarg'a tinmay qag'illayapti — ovozini o'chirish kerak.", "Ворон не перестаёт каркать — нужно лишить его голоса.", "A raven won't stop cawing — it must be silenced."],
    engorgio: ["Qovoq juda kichik — uni kattalashtirish kerak.", "Тыква слишком мала — её нужно увеличить.", "The pumpkin is far too small — make it bigger."],
    reducio: ["Sandiq eshikdan sig'mayapti — uni kichraytirish kerak.", "Сундук не проходит в дверь — его нужно уменьшить.", "The trunk won't fit through the door — make it smaller."],
    colloportus: ["Quvg'inchilar eshikdan kirmasligi kerak — uni qulflang.", "Преследователи не должны войти в дверь — заприте её.", "Your pursuers mustn't get through the door — lock it."],
    obliviate: ["Maggl sehrni ko'rib qoldi — u buni unutishi kerak.", "Магл увидел волшебство — он должен это забыть.", "A Muggle has seen magic — they must forget it."]
  };
  var AF_N = 30;
  var af = null;      // {id, round, pts:[...], idx, drawing, trail, done, msg, ok, bajar}

  // Siniq chiziqni teng oraliqli AF_N nuqtaga bo'lish
  function afResample(s, n) {
    var cum = [0], i;
    for (i = 1; i < s.length; i++) { cum.push(cum[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1])); }
    var len = cum[cum.length - 1] || 1, out = [], seg = 1;
    for (var k = 0; k < n; k++) {
      var d = len * k / (n - 1);
      while (seg < s.length - 1 && cum[seg] < d) { seg++; }
      var t = (d - cum[seg - 1]) / ((cum[seg] - cum[seg - 1]) || 1);
      out.push([s[seg - 1][0] + (s[seg][0] - s[seg - 1][0]) * t, s[seg - 1][1] + (s[seg][1] - s[seg - 1][1]) * t]);
    }
    return out;
  }

  /* Darslar rejasi (bot: hpdars.AFSUN_DARS = 48):
       1-24  o'rganish: bitta afsun, uch urinish - chiziq ko'rinadi -> xira -> yoddan
       25-36 vaziyat:   ikki vaziyat - afsunni o'zi topadi (4 variant), keyin yoddan chizadi
       37-48 ketma-ket: uch afsun birin-ketin, yoddan, bitta sham
     Bellashuv - o'rganish darsidek. */
  var AF_TARTIB = ["lumos", "leviosa", "alohomora", "expelliarmus", "accio", "protego",
                   "incendio", "reparo", "stupefy", "aguamenti", "nox", "patronum",
                   "petrificus", "impedimenta", "riddikulus", "finite", "reducto", "diffindo",
                   "episkey", "silencio", "engorgio", "reducio", "colloportus", "obliviate"];     // bot: hpdars.DARSLAR bilan bir xil
  function afPlan(n) {
    var T = AF_TARTIB, L = T.length, k;
    if (n <= L) { return { mode: "oquv", steps: [1, 0.3, 0].map(function (r) { return { id: T[n - 1], r: r }; }) }; }
    if (n <= L + 12) {
      k = n - L - 1;
      return { mode: "vaz", steps: [{ id: T[(k * 7 + 3) % L], r: 0, ask: true }, { id: T[(k * 7 + 15) % L], r: 0, ask: true }] };
    }
    k = (n - L - 13) % 12;
    return { mode: "zan", steps: [0, 1, 2].map(function (j) { return { id: T[(k * 5 + 1 + j * 8) % L], r: 0 }; }) };
  }
  function afFlImg(k) { return IMG_DIR + "flitvik/" + k + ".webp"; }
  function afR() { return af.steps[Math.min(af.round, af.steps.length - 1)].r; }
  // Vaqt (sham): shakl uzunligiga qarab, dars oshgani sari qisqaradi. Kechiksa urinish kuymaydi - baho pasayadi.
  function afLim(id, n) {
    var uz = 0, sh = AF[id].s;
    for (var q = 1; q < sh.length; q++) { uz += Math.hypot(sh[q][0] - sh[q - 1][0], sh[q][1] - sh[q - 1][1]); }
    return Math.round((1.6 + uz * (4.2 - 2.2 * Math.min(n - 1, 23) / 23)) * 1000);
  }

  function afOpen(bell, n) {
    var st = drData && drData.afsun, plan;
    if (bell === true) {
      var item = st && st.contest && st.contest.item, bid = AF[item] ? item : "lumos";
      plan = { mode: "bell", steps: [1, 0.3, 0].map(function (r) { return { id: bid, r: r }; }) };
    } else if (bell === "rek") {
      var rs = [];
      for (var ri = 0; ri < 80; ri++) {
        var rid = AF_TARTIB[Math.floor(Math.random() * AF_TARTIB.length)];
        if (ri && rs[ri - 1].id === rid) { rid = AF_TARTIB[(AF_TARTIB.indexOf(rid) + 5) % AF_TARTIB.length]; }
        rs.push({ id: rid, r: 0.3 });
      }
      plan = { mode: "rek", steps: rs };
    } else { plan = afPlan(n || 1); }
    af = { id: plan.steps[0].id, steps: plan.steps, mode: plan.mode, round: 0, idx: 0, drawing: false, trail: [], done: false, msg: "", ok: false, show: false,
           bell: bell === true, rek: bell === "rek", n: n || 1, ask: false,
           sp: [], fx: null, t0: 0, pct: 1, fails: 0, dsum: 0, dn: 0, used: false, off: false, rounds: [], raf: 0, hz: 0 };
    drShowGame("scr-afsun");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var i = new Image(); i.src = afFlImg(k); });
    var x = drX(), f = drFan("afsun");
    $("af-kick").textContent = f.nom[lang];
    $("af-ttl").textContent = f.ust[lang];
    $("af-today").textContent = af.rek ? x.rekT : af.bell ? x.bell : x.lvl(af.n) + (af.mode === "vaz" ? " · " + x.afVazK : af.mode === "zan" ? " · " + x.afZanK : "");
    $("af-res").classList.add("hidden");
    $("af-stage").classList.remove("hidden");
    $("af-show").textContent = x.afShow;
    var afY = qrYordam(["kalmar", "boutrakl"], af.bell || af.rek);
    af.kx = afY.kalmar ? 1.25 : 1;
    af.bt = !!afY.boutrakl;
    if (af.mode === "zan") {     // bitta sham uchala afsunga (orasidagi tanaffuslar bilan)
      af.lim = Math.round((1800 + af.steps.reduce(function (a, q) { return a + afLim(q.id, af.n); }, 0)) * af.kx);
    }
    afStepSet();
  }

  // Navbatdagi qadam: afsun, sarlavha, (vaziyatda) variantlar
  function afStepSet() {
    var x = drX(), q = af.steps[af.round], a = AF[q.id][lang] || AF[q.id].uz;
    af.id = q.id;
    af.ask = !!q.ask;
    if (af.mode !== "zan") { af.lim = Math.round(afLim(q.id, af.rek ? Math.min(24, 4 + af.round * 2) : af.n) * af.kx); }
    $("af-stage").classList.toggle("sorov", af.ask);
    $("af-name").textContent = af.ask ? x.afVazT : a[0];
    $("af-desc").textContent = af.ask ? (AF_VAZ[q.id] || [a[1], a[1], a[1]])[lang === "ru" ? 1 : lang === "en" ? 2 : 0] : a[1];
    if (af.ask) { afAsk(); }
    afSize();
    afPaint();
  }
  function afAsk() {
    var x = drX(), box = $("af-opts"), togri = af.id, ids = [togri], k = 0;
    while (ids.length < 4 && k < 200) {
      var c = AF_TARTIB[Math.floor(afRnd(af.n * 31 + af.round * 7 + k++) * AF_TARTIB.length)];
      if (ids.indexOf(c) < 0) { ids.push(c); }
    }
    ids.sort(function () { return Math.random() - 0.5; });
    box.innerHTML = "";
    ids.forEach(function (id) {
      var b = drEl("button", "tr-o", (AF[id][lang] || AF[id].uz)[0]);
      b.type = "button";
      b.addEventListener("click", function () {
        if (!af || !af.ask || b.classList.contains("xato")) { return; }
        if (id !== togri) {
          b.classList.add("xato");
          af.fails++;
          showToast(x.afVazNo, "err");
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
          return;
        }
        af.ask = false;
        $("af-stage").classList.remove("sorov");
        $("af-name").textContent = (AF[id][lang] || AF[id].uz)[0];
        afSize();
        afPaint();
      });
      box.appendChild(b);
    });
  }

  function afSize() {
    var c = $("af-canvas"), w = Math.min(c.parentNode.clientWidth || 320, 360);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.style.width = w + "px";
    c.style.height = w + "px";
    c.width = Math.round(w * dpr);
    c.height = Math.round(w * dpr);
    af.w = w;
    af.dpr = dpr;
    af.pts = afResample(AF[af.id].s, AF_N).map(function (p) { return [p[0] * w, p[1] * w]; });
  }

  function afPaint() {
    if (!af) { return; }
    var x = drX(), c = $("af-canvas"), g = c.getContext("2d"), w = af.w, i;
    g.setTransform(af.dpr, 0, 0, af.dpr, 0, 0);
    g.clearRect(0, 0, w, w);
    var ochiq = af.show ? 0.85 : afR() * 0.85;
    if (ochiq > 0) {
      g.lineCap = "round"; g.lineJoin = "round";
      g.strokeStyle = "rgba(160,190,240," + ochiq + ")";
      g.lineWidth = 3;
      g.setLineDash([2, 10]);
      g.beginPath();
      af.pts.forEach(function (p, k) { if (k) { g.lineTo(p[0], p[1]); } else { g.moveTo(p[0], p[1]); } });
      g.stroke();
      g.setLineDash([]);
      // oxiri - kichik halqa
      var e = af.pts[af.pts.length - 1];
      g.strokeStyle = "rgba(160,190,240," + ochiq + ")";
      g.lineWidth = 2;
      g.beginPath(); g.arc(e[0], e[1], 9, 0, Math.PI * 2); g.stroke();
    }
    // boshlanish nuqtasi doim ko'rinadi
    var s = af.pts[0];
    g.fillStyle = "rgba(243,213,143,.25)";
    g.beginPath(); g.arc(s[0], s[1], 17, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f3d58f";
    g.beginPath(); g.arc(s[0], s[1], 7, 0, Math.PI * 2); g.fill();
    // chizilgan iz
    if (af.trail.length > 1) {
      g.lineCap = "round"; g.lineJoin = "round";
      g.shadowColor = af.ok ? "rgba(243,213,143,.95)" : af.off ? "rgba(255,130,110,.9)" : "rgba(150,200,255,.9)";
      g.shadowBlur = 14;
      g.strokeStyle = af.ok ? "#f3d58f" : af.off ? "#ffc1b6" : "#cfe4ff";
      g.lineWidth = 5;
      g.beginPath();
      for (i = 0; i < af.trail.length; i++) { if (i) { g.lineTo(af.trail[i][0], af.trail[i][1]); } else { g.moveTo(af.trail[i][0], af.trail[i][1]); } }
      g.stroke();
      g.shadowBlur = 0;
    }
    // tayoqcha izi: oltin uchqunlar
    var now = Date.now();
    af.sp = af.sp.filter(function (u) { return now - u.t < 520; });
    af.sp.forEach(function (u) {
      var k = (now - u.t) / 520;
      g.fillStyle = "rgba(243,213,143," + (1 - k) + ")";
      g.beginPath(); g.arc(u.x + u.vx * k, u.y + u.vy * k + 18 * k * k, 3.4 * (1 - k) + 0.8, 0, Math.PI * 2); g.fill();
    });
    if (af.fx) { afFx(g, af.fx.id, Math.min(1, (now - af.fx.t0) / af.fx.ms), w); }
    // sham
    var sham = $("af-sham");
    if (sham) {
      sham.classList.toggle("hidden", af.bell);
      if (!af.bell) {
        if (af.t0) { af.pct = Math.max(0, 1 - (now - af.t0) / af.lim); }
        $("af-sham-w").style.width = (af.pct * 100).toFixed(1) + "%";
        sham.classList.toggle("ochdi", af.pct <= 0);
        sham.classList.toggle("oz", af.pct > 0 && af.pct < 0.3);
      }
    }
    var ko = afR(), jami = af.steps.length;
    $("af-step").textContent = (af.rek ? x.rekT + " · " + af.round : (af.mode === "vaz" || af.mode === "zan" ? x.afNth : x.afStep)(Math.min(af.round + 1, jami), jami)) + (bl && af.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "") +
      (!af.bell && af.pct <= 0 && !af.done ? " · " + x.afKech : "");
    $("af-hint").textContent = af.msg || x.afR[ko >= 1 ? 0 : ko > 0 ? 1 : 2];
    $("af-hint").classList.toggle("bad", !!af.bad);
    // Professor Flitvik: holatiga qarab rasmi almashadi
    var kayf = af.bad ? "xafa" : (af.ok && af.kayf) || "maslahat", fim = $("af-fl-im");
    if (fim && af.kayfEl !== kayf) { af.kayfEl = kayf; fim.src = afFlImg(kayf); }
    $("af-show").classList.toggle("hidden", af.bell || af.ask || afR() > 0 || af.show || af.done);
  }

  function afXY(ev) {
    var r = $("af-canvas").getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top];
  }
  // Nuqtadan chiziqqacha eng qisqa masofa
  function afDist(p) {
    var best = 1e9, a, b, t, dx, dy, i;
    for (i = 1; i < af.pts.length; i++) {
      a = af.pts[i - 1]; b = af.pts[i];
      dx = b[0] - a[0]; dy = b[1] - a[1];
      t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / ((dx * dx + dy * dy) || 1)));
      best = Math.min(best, Math.hypot(p[0] - (a[0] + dx * t), p[1] - (a[1] + dy * t)));
    }
    return best;
  }

  // Rekord tugadi (chetga chiqdi, sham o'chdi yoki hamma afsun bajarildi)
  function afRekTugat(hammasi) {
    if (!af || af.rekTug) { return; }
    af.rekTug = true;
    var asc = af.round + (hammasi ? 1 : 0);
    af.done = true; af.drawing = false;
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    $("af-stage").classList.add("hidden");
    rekEnd("afsun", asc, $("af-res"));
  }
  function afFail(matn) {
    if (af.rek) { afRekTugat(false); return; }
    if (bl && af.bell) { bl.xato++; }
    af.fails++;
    af.off = false;
    af.drawing = false;
    af.msg = matn;
    af.bad = true;
    afPaint();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    setTimeout(function () { if (af && !af.drawing && !af.done) { af.trail = []; af.idx = 0; afPaint(); } }, 650);
  }

  function afDown(ev) {
    if (!af || af.done || af.lock || af.ask) { return; }
    var p = afXY(ev), x = drX(), tol = af.w * 0.13;
    af.bad = false;
    af.ok = false;
    if (Math.hypot(p[0] - af.pts[0][0], p[1] - af.pts[0][1]) > tol * 1.5) { af.msg = x.afStart; af.bad = true; af.trail = []; afPaint(); return; }
    af.drawing = true;
    af.idx = 0;
    af.msg = "";
    af.trail = [p];
    af.dsum = 0; af.dn = 0; af.off = false;
    if (!af.t0 && !af.bell) { af.t0 = Date.now(); }
    afLoop();
    try { ev.preventDefault(); } catch (e) {}
    afPaint();
  }

  function afMove(ev) {
    if (!af || !af.drawing) { return; }
    var p = afXY(ev), tol = af.w * (0.13 + (afR() === 0 ? 0.02 : 0));
    af.trail.push(p);
    var d = afDist(p), now = Date.now();
    af.dsum += d; af.dn++;
    if (af.sp.length < 120) {
      af.sp.push({ x: p[0], y: p[1], vx: (Math.random() - 0.5) * 26, vy: (Math.random() - 0.5) * 26, t: now });
      af.sp.push({ x: p[0], y: p[1], vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.7) * 30, t: now });
    }
    if (d > tol * 1.9) { afFail(drX().afOff); return; }
    af.off = d > tol * 1.15;
    if (af.off && now - af.hz > 160) { af.hz = now; try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("soft"); } } catch (e) {} }
    afLoop();
    while (af.idx < af.pts.length - 1 && Math.hypot(p[0] - af.pts[af.idx + 1][0], p[1] - af.pts[af.idx + 1][1]) < tol) { af.idx++; }
    afPaint();
  }

  function afUp() {
    if (!af || !af.drawing) { return; }
    af.drawing = false;
    var x = drX();
    if (af.idx < af.pts.length - 2) { afFail(x.afShort); return; }
    // urinish o'tdi
    var otgan = af.t0 ? Date.now() - af.t0 : 0;
    // Aniqlik: duel bilan bir xil QATTIQ o'lchov (duAcc, js/09-duel.js - egasi, 2026-10-09); yoddan chizilganda chegaralar kengroq
    var aniq = null, wn = af.w || 1, nm = function (v) { return v.map(function (p) { return [p[0] / wn, p[1] / wn]; }); };
    try { aniq = duAcc(nm(af.pts), nm(af.trail), afR() === 0 && !af.show); } catch (e) {}
    af.rounds.push({ a: aniq, r: (af.dsum / (af.dn || 1)) / (af.w * 0.13), fails: af.fails, used: af.used && !af.bt,
                     late: !af.bell && otgan > af.lim ? (otgan > af.lim * 2 ? 2 : 1) : 0 });
    var tugadi = af.round >= af.steps.length - 1, oxir = af.rounds[af.rounds.length - 1];
    if (af.mode !== "zan" || tugadi) { af.t0 = 0; }
    af.off = false;
    af.ok = true;
    // Professor Flitvik izohi (bellashuvda - eski qisqa matn)
    var fl = oxir.late ? x.afFl.c : ((oxir.a != null ? oxir.a >= 85 : oxir.r < 0.4) && !oxir.fails && !oxir.used ? x.afFl.a : x.afFl.b);
    af.msg = af.bell ? x.afOk[Math.min(af.round, 2)] : fl[(af.n + af.round) % fl.length];
    af.kayf = fl === x.afFl.a ? "zor" : fl === x.afFl.b ? "yaxshi" : "maslahat";
    af.bad = false;
    af.lock = true;
    afPaint();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    setTimeout(function () {
      if (!af) { return; }
      af.lock = false;
      if (!tugadi) {
        af.round++;
        af.trail = [];
        af.idx = 0;
        af.ok = false;
        af.msg = "";
        af.show = false;
        af.fails = 0; af.used = false;
        if (af.mode !== "zan") { af.pct = 1; }
        afStepSet();
        return;
      }
      if (af.rek) { afRekTugat(true); return; }
      af.done = true;
      if (af.bell) {
        $("af-stage").classList.add("hidden");
        blFinish($("af-res"));
        return;
      }
      afEnd();
    }, 900);
  }

  // Baho (asardagi imtihon baholari): aniqlik + xatolar + vaqt. 5 A'lo, 4 Kutilganidan yuqori, 3 Qoniqarli (o'tadi), 2 Yomon, 1 Troll
  function afScore() {
    var sum = 0, acc = 0, vaqt = 0;
    af.rounds.forEach(function (q) {
      var a = q.a != null ? q.a : 100 * Math.max(0, Math.min(1, 1 - (q.r - 0.25) / 1.1));
      acc += a;
      if (!q.late) { vaqt++; }
      sum += Math.max(0, a - Math.min(q.fails, 3) * 12 - (q.used ? 20 : 0) - q.late * 20);
    });
    var n = af.rounds.length || 1, s = sum / n;
    return { acc: Math.round(acc / n), vaqt: vaqt, n: n, baho: s >= 85 ? 5 : s >= 70 ? 4 : s >= 50 ? 3 : s >= 30 ? 2 : 1 };
  }
  // Eng yaxshi baho shu qurilmada (fan bo'yicha): darslar to'rida halqa bilan ko'rinadi
  var DR_BAHO_K = { afsun: "hp_af_baho", iksir: "hp_ik_baho", himoya: "hp_hm_baho", uchish: "hp_uc_baho", maxluq: "hp_mx_baho", astro: "hp_yl_baho", osimlik: "hp_os_baho", trans: "hp_tf_baho" };
  function drBahoGet(fan, n) { try { return (JSON.parse(localStorage.getItem(DR_BAHO_K[fan]) || "{}") || {})[n] || 0; } catch (e) { return 0; } }
  var drBahoOx = null;      // oxirgi qo'yilgan baho - drDone uni serverga ham yuboradi (qobiliyatlar boshqalarga ko'rinishi uchun)
  function drBahoSave(fan, n, b) {
    drBahoOx = { fan: fan, n: n, b: b };
    try {
      var m = JSON.parse(localStorage.getItem(DR_BAHO_K[fan]) || "{}") || {};
      if (!(m[n] >= b)) { m[n] = b; localStorage.setItem(DR_BAHO_K[fan], JSON.stringify(m)); }
    } catch (e) {}
  }
  function afBahoSave(n, b) { drBahoSave("afsun", n, b); }
  function afBahoEl(sc) {
    var x = drX(), el = drEl("div", "af-baho b" + sc.baho), pp = drEl("span", "af-baho-p");
    for (var i = 1; i <= 5; i++) { pp.appendChild(drEl("i", i <= sc.baho ? "on" : "")); }
    el.appendChild(drEl("small", "af-baho-k", x.afBahoT));
    el.appendChild(drEl("b", "af-baho-n", x.afBaho[sc.baho - 1]));
    el.appendChild(pp);
    el.appendChild(drEl("span", "af-baho-s", sc.izoh || (x.afAcc(sc.acc) + " · " + x.afVaqt(sc.vaqt, sc.n))));
    return el;
  }

  // Dars oxiri: afsun natijasi (animatsiya) -> baho. «Qoniqarli»dan past bo'lsa dars o'tmaydi.
  function afEnd() {
    var x = drX(), me = af, sc = afScore(), daraja = af.n, otdi = sc.baho >= 3;
    af.fx = { id: otdi ? af.id : "puf", t0: Date.now(), ms: otdi ? 1700 : 800 };
    af.msg = otdi ? (AF[af.id][lang] || AF[af.id].uz)[0] + "!" : x.afPuf;
    af.bad = !otdi;
    af.ok = otdi;
    af.kayf = "zor";
    if (!otdi) { af.trail = []; }
    afLoop();
    setTimeout(function () {
      if (af !== me) { return; }
      af.fx = null;
      var show = function (yangi) {
        if (af !== me) { return; }
        var box = $("af-res");
        $("af-stage").classList.add("hidden");
        if (otdi) { drResult(box, "«" + x.afFlB[sc.baho - 1] + "»", "afsun", daraja, yangi); }
        else {
          box.innerHTML = "";
          box.appendChild(drEl("p", "dr-res-t", "«" + x.afFlB[sc.baho - 1] + "»"));
          box.appendChild(drEl("p", "dr-res-s", x.afLow));
          var r = drEl("button", "dr-btn", x.retry);
          r.type = "button";
          r.addEventListener("click", function () { afOpen(false, daraja); });
          box.appendChild(r);
          var b = drEl("button", "dr-btn ikkinchi", x.toList);
          b.type = "button";
          b.addEventListener("click", function () { af = null; fanOpen("afsun"); });
          box.appendChild(b);
          box.classList.remove("hidden");
        }
        var ft = box.querySelector(".dr-res-t");
        if (ft) {
          var fi = document.createElement("img");
          fi.className = "af-fl-big";
          fi.alt = "";
          fi.src = afFlImg(sc.baho >= 5 ? "zor" : sc.baho === 4 ? "yaxshi" : sc.baho === 3 ? "maslahat" : "xafa");
          box.insertBefore(fi, ft);
          box.insertBefore(drEl("small", "af-baho-k", x.afFlN), ft);
        }
        box.insertBefore(afBahoEl(sc), box.firstChild);
      };
      if (otdi) { afBahoSave(daraja, sc.baho); drDone("afsun", daraja, show); } else { show(null); }
    }, af.fx.ms);
  }

  // Chizish paytida kadrlar: sham, uchqunlar va afsun natijasi uchun
  function afLoop() {
    if (!af || af.raf) { return; }
    var step = function () {
      if (!af) { return; }
      af.raf = 0;
      if ($("scr-afsun").classList.contains("hidden")) { return; }
      afPaint();
      if (af.rek && !af.done && af.t0 && af.pct <= 0) { afRekTugat(false); return; }
      if (af.sp.length || af.fx || (af.t0 && !af.done)) { af.raf = requestAnimationFrame(step); }
    };
    af.raf = requestAnimationFrame(step);
  }

  function afRnd(i) { var v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); }
  function afGlow(g, x, y, rad, rgb, al) {
    if (!(rad > 0) || !(al > 0)) { return; }
    var gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, "rgba(" + rgb + "," + Math.min(1, al) + ")");
    gr.addColorStop(1, "rgba(" + rgb + ",0)");
    g.fillStyle = gr;
    g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }
  // Afsun natijasi: t 0..1. Har afsunning o'z ko'rinishi; "puf" - afsun chiqmadi.
  function afFx(g, id, t, w) {
    var e = 1 - Math.pow(1 - t, 3), fade = t < 0.7 ? 1 : Math.max(0, (1 - t) / 0.3), P2 = Math.PI * 2, i, a, ph, px, py;
    var path = function (k) {
      g.beginPath();
      af.pts.forEach(function (p, j) {
        var qx = 0.5 * w + (p[0] - 0.5 * w) * k, qy = 0.5 * w + (p[1] - 0.5 * w) * k;
        if (j) { g.lineTo(qx, qy); } else { g.moveTo(qx, qy); }
      });
    };
    g.save();
    g.lineCap = "round"; g.lineJoin = "round";
    if (id === "lumos") {
      afGlow(g, 0.5 * w, 0.18 * w, (0.15 + 0.6 * e) * w, "255,244,200", 0.9 * fade);
      afGlow(g, 0.5 * w, 0.18 * w, 0.09 * w, "255,255,255", fade);
    } else if (id === "nox") {
      g.fillStyle = "rgba(0,0,0," + 0.85 * e * fade + ")"; g.fillRect(0, 0, w, w);
      afGlow(g, 0.5 * w, 0.82 * w, 0.32 * (1 - e) * w, "255,244,200", 0.9);
    } else if (id === "leviosa") {
      px = (0.5 + 0.06 * Math.sin(t * 9)) * w; py = (0.82 - 0.5 * e) * w;
      afGlow(g, px, py, 0.22 * w, "200,225,255", 0.35 * fade);
      g.translate(px, py); g.rotate(-0.6 + 0.25 * Math.sin(t * 7)); g.globalAlpha = fade;
      g.fillStyle = "#f4f7ff"; g.beginPath(); g.ellipse(0, 0, 0.035 * w, 0.13 * w, 0, 0, P2); g.fill();
      g.strokeStyle = "#9fb3d6"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -0.13 * w); g.lineTo(0, 0.19 * w); g.stroke();
    } else if (id === "alohomora" || id === "colloportus") {
      px = 0.5 * w; py = 0.52 * w;
      afGlow(g, px, py, 0.36 * w, id === "alohomora" ? "243,213,143" : "150,200,255", 0.4 * e * fade);
      g.globalAlpha = fade;
      g.strokeStyle = "#e9eef8"; g.lineWidth = 0.035 * w;
      g.save(); g.translate(px + 0.09 * w, py - 0.06 * w); g.rotate(0.9 * (id === "alohomora" ? e : 1 - Math.min(1, t * 2.2)));
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -0.07 * w); g.arc(-0.09 * w, -0.07 * w, 0.09 * w, 0, Math.PI, true); g.lineTo(-0.18 * w, -0.01 * w); g.stroke();
      g.restore();
      g.fillStyle = "#f3d58f"; g.fillRect(px - 0.15 * w, py - 0.06 * w, 0.3 * w, 0.24 * w);
      g.fillStyle = "#3a2c12"; g.beginPath(); g.arc(px, py + 0.04 * w, 0.028 * w, 0, P2); g.fill();
      g.fillRect(px - 0.011 * w, py + 0.04 * w, 0.022 * w, 0.07 * w);
    } else if (id === "expelliarmus") {
      g.fillStyle = "rgba(255,70,60," + 0.35 * (1 - t) + ")"; g.fillRect(0, 0, w, w);
      afGlow(g, 0.3 * w, 0.6 * w, 0.5 * e * w, "255,90,70", 0.6 * (1 - t));
      g.translate((0.5 + 0.36 * e) * w, (0.55 - 0.42 * e + 0.25 * t * t) * w); g.rotate(t * 14); g.globalAlpha = fade;
      g.strokeStyle = "#c79a5b"; g.lineWidth = 0.022 * w; g.beginPath(); g.moveTo(-0.12 * w, 0); g.lineTo(0.12 * w, 0); g.stroke();
    } else if (id === "accio") {
      var sc = 0.15 + 0.85 * e;
      g.strokeStyle = "rgba(200,225,255," + 0.55 * (1 - e) + ")"; g.lineWidth = 2;
      for (i = 0; i < 10; i++) {
        a = i * P2 / 10;
        g.beginPath(); g.moveTo(0.5 * w + Math.cos(a) * 0.46 * w, 0.5 * w + Math.sin(a) * 0.46 * w);
        g.lineTo(0.5 * w + Math.cos(a) * (0.46 - 0.2 * e) * w, 0.5 * w + Math.sin(a) * (0.46 - 0.2 * e) * w); g.stroke();
      }
      afGlow(g, 0.5 * w, (0.2 + 0.3 * e) * w, 0.34 * w * sc, "200,225,255", 0.45 * fade);
      g.translate(0.5 * w, (0.2 + 0.3 * e) * w); g.scale(sc, sc); g.rotate((1 - e) * 1.2); g.globalAlpha = fade;
      g.fillStyle = "#7a3b2e"; g.fillRect(-0.13 * w, -0.17 * w, 0.26 * w, 0.34 * w);
      g.fillStyle = "#f3d58f"; g.fillRect(-0.13 * w, -0.17 * w, 0.035 * w, 0.34 * w);
      g.strokeStyle = "#f3d58f"; g.lineWidth = 0.008 * w; g.strokeRect(-0.06 * w, -0.11 * w, 0.15 * w, 0.1 * w);
    } else if (id === "protego") {
      path(1); g.closePath(); g.fillStyle = "rgba(120,180,255," + 0.32 * e * fade + ")"; g.fill();
      g.shadowColor = "rgba(150,200,255,.9)"; g.shadowBlur = 22;
      g.strokeStyle = "rgba(210,232,255," + fade + ")"; g.lineWidth = 4; g.stroke(); g.shadowBlur = 0;
      for (i = 0; i < 3; i++) {
        ph = (t * 1.6 + i / 3) % 1;
        path(1 + ph * 0.5); g.closePath(); g.strokeStyle = "rgba(170,210,255," + 0.5 * (1 - ph) * fade + ")"; g.lineWidth = 2; g.stroke();
      }
    } else if (id === "incendio") {
      afGlow(g, 0.5 * w, 0.72 * w, 0.48 * w, "255,140,40", 0.45 * fade * e);
      for (i = 0; i < 30; i++) {
        ph = (t * 2.2 + afRnd(i)) % 1;
        afGlow(g, (0.5 + (afRnd(i + 40) - 0.5) * 0.42 * (1 - ph * 0.7)) * w, (0.82 - ph * 0.55) * w,
               (0.02 + 0.07 * (1 - ph)) * w, ph < 0.4 ? "255,225,130" : "255,120,40", 0.85 * (1 - ph) * fade);
      }
    } else if (id === "reparo") {
      for (i = 0; i < 6; i++) {
        a = i * Math.PI / 3;
        var uzoq = (1 - e) * 0.3 * w * (0.6 + afRnd(i));
        g.save(); g.translate(0.5 * w + Math.cos(a + 0.52) * uzoq, 0.52 * w + Math.sin(a + 0.52) * uzoq);
        g.rotate((1 - e) * (afRnd(i + 9) - 0.5) * 3); g.globalAlpha = fade;
        g.fillStyle = i % 2 ? "#e9eef8" : "#cfd8ea";
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 0.22 * w, a, a + Math.PI / 3); g.closePath(); g.fill();
        g.restore();
      }
      if (t > 0.6) {
        g.shadowColor = "rgba(243,213,143,.9)"; g.shadowBlur = 18;
        g.strokeStyle = "rgba(243,213,143," + fade * Math.min(1, (t - 0.6) / 0.15) + ")"; g.lineWidth = 3;
        g.beginPath(); g.arc(0.5 * w, 0.52 * w, 0.22 * w, 0, P2); g.stroke();
      }
    } else if (id === "stupefy") {
      g.fillStyle = "rgba(255,40,40," + 0.4 * (1 - t) + ")"; g.fillRect(0, 0, w, w);
      var en = af.pts[af.pts.length - 1];
      afGlow(g, en[0], en[1], 0.45 * e * w, "255,70,60", 0.7 * fade);
      g.shadowColor = "rgba(255,60,60,.95)"; g.shadowBlur = 26;
      g.strokeStyle = "rgba(255,180,170," + fade + ")"; g.lineWidth = 7;
      path(1); g.stroke();
    } else if (id === "aguamenti") {
      afGlow(g, 0.84 * w, 0.72 * w, 0.34 * e * w, "90,160,255", 0.4 * fade);
      for (i = 0; i < 36; i++) {
        ph = (t * 1.8 + afRnd(i)) % 1;
        afGlow(g, (0.12 + 0.8 * ph) * w, (0.5 - 0.2 * Math.sin(ph * Math.PI * 3) + ph * ph * 0.34 * afRnd(i + 5)) * w,
               (0.025 + 0.03 * afRnd(i + 3)) * w, "130,195,255", 0.85 * fade);
      }
    } else if (id === "patronum") {
      afGlow(g, 0.5 * w, 0.5 * w, (0.2 + 0.6 * e) * w, "215,235,255", 0.85 * fade);
      for (i = 0; i < 3; i++) {
        ph = (t * 1.5 + i / 3) % 1;
        g.strokeStyle = "rgba(230,242,255," + 0.6 * (1 - ph) * fade + ")"; g.lineWidth = 3;
        g.beginPath(); g.arc(0.5 * w, 0.5 * w, ph * 0.55 * w + 1, 0, P2); g.stroke();
      }
      afGlow(g, 0.5 * w, 0.5 * w, 0.11 * w, "255,255,255", fade);
    } else if (id === "petrificus") {
      afGlow(g, 0.5 * w, 0.5 * w, 0.5 * w, "200,225,255", 0.45 * (1 - t));
      g.translate(0.5 * w, 0.8 * w); g.rotate(Math.max(0, (t - 0.35) / 0.65) * Math.max(0, (t - 0.35) / 0.65) * Math.PI / 2); g.globalAlpha = fade;
      g.fillStyle = "#cfe0f5";
      g.beginPath(); g.arc(0, -0.5 * w, 0.06 * w, 0, P2); g.fill();
      g.fillRect(-0.05 * w, -0.43 * w, 0.1 * w, 0.43 * w);
    } else if (id === "impedimenta") {
      for (i = 0; i < 4; i++) {
        ph = 1 - ((t * 1.1 + i / 4) % 1);
        g.strokeStyle = "rgba(120,225,215," + 0.7 * (1 - ph) * fade + ")"; g.lineWidth = 3;
        g.beginPath(); g.arc(0.5 * w, 0.5 * w, ph * 0.46 * w + 2, 0, P2); g.stroke();
      }
      afGlow(g, 0.5 * w, 0.5 * w, 0.16 * w, "120,225,215", 0.7 * e * fade);
    } else if (id === "riddikulus") {
      var rang = ["255,120,150", "255,210,90", "120,220,160", "130,190,255", "210,150,255"];
      for (i = 0; i < 40; i++) {
        a = afRnd(i) * P2; ph = 0.12 + 0.36 * afRnd(i + 20);
        afGlow(g, (0.5 + Math.cos(a) * ph * e) * w, (0.5 + Math.sin(a) * ph * e + 0.18 * t * t) * w, (0.018 + 0.02 * afRnd(i + 60)) * w, rang[i % 5], fade);
      }
    } else if (id === "finite") {
      afGlow(g, 0.5 * w, 0.5 * w, 0.42 * (1 - e) * w + 1, "255,170,160", 0.8);
      g.strokeStyle = "rgba(240,244,255," + fade + ")"; g.lineWidth = 3; g.shadowColor = "rgba(240,244,255,.9)"; g.shadowBlur = 16;
      g.beginPath(); g.moveTo(0.2 * w, 0.2 * w); g.lineTo((0.2 + 0.6 * Math.min(1, t * 2.5)) * w, (0.2 + 0.6 * Math.min(1, t * 2.5)) * w); g.stroke();
    } else if (id === "reducto") {
      afGlow(g, 0.5 * w, 0.5 * w, 0.5 * e * w, "130,180,255", 0.6 * (1 - t));
      for (i = 0; i < 9; i++) {
        px = (i % 3 - 1) * 0.11; py = (Math.floor(i / 3) - 1) * 0.11;
        g.save(); g.translate((0.5 + px * (1 + e * 3.2)) * w, (0.5 + py * (1 + e * 3.2) + 0.2 * t * t) * w);
        g.rotate(e * (afRnd(i) - 0.5) * 5); g.globalAlpha = fade;
        g.fillStyle = i % 2 ? "#8b93a6" : "#6f778a"; g.fillRect(-0.05 * w, -0.05 * w, 0.1 * w, 0.1 * w);
        g.restore();
      }
    } else if (id === "diffindo") {
      g.globalAlpha = fade; g.strokeStyle = "#c9a36a"; g.lineWidth = 0.03 * w;
      g.save(); g.translate(0.5 * w, 0.5 * w); g.rotate(-0.5 * e); g.beginPath(); g.moveTo(-0.01 * w, 0); g.lineTo(-0.36 * w, 0); g.stroke(); g.restore();
      g.save(); g.translate(0.5 * w, 0.5 * w); g.rotate(0.5 * e); g.beginPath(); g.moveTo(0.01 * w, 0); g.lineTo(0.36 * w, 0); g.stroke(); g.restore();
      g.globalAlpha = 1; afGlow(g, 0.5 * w, 0.5 * w, 0.2 * w, "255,255,255", 0.9 * (1 - t));
    } else if (id === "episkey") {
      afGlow(g, 0.5 * w, 0.5 * w, (0.25 + 0.2 * Math.sin(t * 9) * (1 - t) + 0.15 * e) * w, "150,230,170", 0.6 * fade);
      g.globalAlpha = fade; g.fillStyle = "#eafff0";
      g.fillRect(0.46 * w, 0.36 * w, 0.08 * w, 0.28 * w); g.fillRect(0.36 * w, 0.46 * w, 0.28 * w, 0.08 * w);
    } else if (id === "silencio") {
      for (i = 0; i < 4; i++) {
        ph = (0.12 + i * 0.09) * (1 - e);
        g.strokeStyle = "rgba(200,215,240," + (1 - e) + ")"; g.lineWidth = 4;
        g.beginPath(); g.arc(0.3 * w, 0.5 * w, ph * w + 1, -0.7, 0.7); g.stroke();
      }
      afGlow(g, 0.3 * w, 0.5 * w, 0.07 * w, "200,215,240", fade);
    } else if (id === "engorgio" || id === "reducio") {
      var ol = id === "engorgio" ? 0.3 + 0.7 * e : 1 - 0.72 * e;
      afGlow(g, 0.5 * w, 0.54 * w, 0.42 * w * ol, id === "engorgio" ? "255,160,70" : "200,160,110", 0.4 * fade);
      g.translate(0.5 * w, 0.54 * w); g.scale(ol, ol); g.globalAlpha = fade;
      if (id === "engorgio") {
        g.fillStyle = "#e8843c"; g.beginPath(); g.ellipse(0, 0, 0.26 * w, 0.21 * w, 0, 0, P2); g.fill();
        g.strokeStyle = "#b85f22"; g.lineWidth = 0.012 * w;
        g.beginPath(); g.ellipse(0, 0, 0.11 * w, 0.21 * w, 0, 0, P2); g.stroke();
        g.fillStyle = "#5f8a4a"; g.fillRect(-0.02 * w, -0.27 * w, 0.04 * w, 0.08 * w);
      } else {
        g.fillStyle = "#7a5230"; g.fillRect(-0.26 * w, -0.14 * w, 0.52 * w, 0.32 * w);
        g.fillStyle = "#5e3d22"; g.fillRect(-0.26 * w, -0.2 * w, 0.52 * w, 0.1 * w);
        g.fillStyle = "#f3d58f"; g.fillRect(-0.035 * w, -0.13 * w, 0.07 * w, 0.08 * w);
      }
    } else if (id === "obliviate") {
      for (i = 0; i < 34; i++) {
        a = afRnd(i) * P2 + t * 3; ph = (0.05 + 0.4 * afRnd(i + 11)) * (0.4 + 0.9 * e);
        afGlow(g, (0.5 + Math.cos(a) * ph) * w, (0.5 + Math.sin(a) * ph * 0.7) * w, (0.03 + 0.04 * afRnd(i + 5)) * w, "225,235,250", 0.55 * (1 - t));
      }
      afGlow(g, 0.5 * w, 0.5 * w, 0.5 * e * w, "225,235,250", 0.4 * fade);
    } else if (id === "puf") {
      for (i = 0; i < 14; i++) {
        a = afRnd(i) * P2;
        afGlow(g, (0.5 + Math.cos(a) * 0.25 * e) * w, (0.5 + Math.sin(a) * 0.2 * e + 0.3 * t * t) * w, 0.028 * w, "170,175,190", 0.7 * (1 - t));
      }
    } else {
      afGlow(g, 0.5 * w, 0.5 * w, (0.2 + 0.5 * e) * w, "243,213,143", 0.7 * fade);
    }
    g.restore();
  }

  /* ================= IKSIRLAR: retsept bo'yicha tartib bilan solish ================= */
  var IK_M = {
    nettle: ["Quritilgan qichitqi o't", "Сушёная крапива", "Dried nettles"], fangs: ["Ilon tishlari", "Змеиные зубы", "Snake fangs"],
    slugs: ["Shoxli shilliqqurtlar", "Рогатые слизни", "Horned slugs"], quills: ["Jayra ignalari", "Иглы дикобраза", "Porcupine quills"],
    lethe: ["Leta daryosi suvi", "Вода из реки Леты", "Lethe River water"], valerian: ["Valeriana novdalari", "Веточки валерианы", "Valerian sprigs"],
    mistletoe: ["Omela mevalari", "Ягоды омелы", "Mistletoe berries"], daisy: ["Moychechak ildizi", "Корни маргаритки", "Daisy roots"],
    fig: ["Tozalangan quruq anjir", "Очищенная сушёная смоква", "Peeled shrivelfig"], caterpillar: ["Kapalak qurtlari", "Гусеницы", "Caterpillars"],
    ratspleen: ["Kalamush talog'i", "Крысиная селезёнка", "Rat spleen"], leech: ["Zuluk sharbati", "Сок пиявки", "Leech juice"],
    bezoar: ["Bezoar toshi", "Безоар", "Bezoar"], unicorn: ["Yakkashox shoxi kukuni", "Толчёный рог единорога", "Powdered unicorn horn"],
    honeywater: ["Asal suvi", "Медовая вода", "Honeywater"], salamander: ["Salamandra qoni", "Кровь саламандры", "Salamander blood"],
    lionfish: ["Sherbaliq tikanlari", "Шипы крылатки", "Lionfish spines"], flobber: ["Flobber-qurt shillig'i", "Слизь флоббер-червя", "Flobberworm mucus"],
    lavender: ["Lavanda", "Лаванда", "Lavender"], cabbage: ["Xitoy chaynar karami", "Китайская жующая капуста", "Chinese chomping cabbage"],
    puffer: ["Sharbaliq ko'zlari", "Глаза рыбы-собаки", "Puffer-fish eyes"], scarab: ["Skarabey qo'ng'izlari", "Жуки-скарабеи", "Scarab beetles"],
    wormwood: ["Shuvoq damlamasi", "Настойка полыни", "Infusion of wormwood"], asphodel: ["Asfodel ildizi kukuni", "Толчёный корень асфоделя", "Powdered root of asphodel"],
    sopophorous: ["Uyqu no'xati sharbati", "Сок дремоносных бобов", "Sopophorous bean juice"], lacewing: ["To'rqanot pashshalar", "Златоглазки", "Lacewing flies"],
    bicorn: ["Ikkishox shoxi kukuni", "Толчёный рог двурога", "Powdered bicorn horn"], boomslang: ["Bumslang terisi", "Шкура бумсланга", "Boomslang skin"],
    hair: ["Bir tola soch", "Один волос", "A single hair"], ashwinder: ["Olovilon tuxumi", "Яйцо огневицы", "Ashwinder egg"],
    horseradish: ["Xren ildizi", "Корень хрена", "Horseradish"], squill: ["Dengiz piyozi", "Морской лук", "Squill bulb"],
    murtlap: ["Murtlap o'simtasi", "Отросток растопырника", "Murtlap tentacle"], thyme: ["Tog'jambil damlamasi", "Настойка тимьяна", "Tincture of thyme"],
    ginger: ["Zanjabil ildizi", "Корень имбиря", "Ginger root"], armadillo: ["Zirhli hayvon safrosi", "Желчь броненосца", "Armadillo bile"],
    moonstone: ["Oy toshi kukuni", "Толчёный лунный камень", "Powdered moonstone"], hellebore: ["Chemeritsa sharbati", "Сироп чемерицы", "Syrup of hellebore"]
  };
  var IK = {
    boils:      { c: "#7fb86a", r: ["nettle", "fangs", "slugs", "quills"], uz: "Chipqonga qarshi damlama", ru: "Зелье от фурункулов", en: "Cure for Boils" },
    forget:     { c: "#8fb7d9", r: ["lethe", "valerian", "mistletoe"], uz: "Unutish damlamasi", ru: "Зелье забвения", en: "Forgetfulness Potion" },
    shrink:     { c: "#9ad04a", r: ["daisy", "fig", "caterpillar", "ratspleen", "leech"], uz: "Kichraytiruvchi eritma", ru: "Уменьшающее зелье", en: "Shrinking Solution" },
    antidote:   { c: "#5fb3a8", r: ["bezoar", "unicorn", "mistletoe", "honeywater"], uz: "Oddiy zaharlarga qarshi dori", ru: "Противоядие от обычных ядов", en: "Antidote to Common Poisons" },
    wiggenweld: { c: "#59c06b", r: ["salamander", "lionfish", "flobber", "honeywater"], uz: "Vigenveld damlamasi", ru: "Рябиновый отвар", en: "Wiggenweld Potion" },
    uyqu:       { c: "#9a86d6", r: ["lavender", "flobber", "valerian"], uz: "Uyqu damlamasi", ru: "Усыпляющее зелье", en: "Sleeping Draught" },
    skelegro:   { c: "#d9d2bb", r: ["cabbage", "puffer", "scarab"], uz: "«Suyako's»", ru: "«Костерост»", en: "Skele-Gro" },
    living:     { c: "#c9b8e6", r: ["wormwood", "asphodel", "valerian", "sopophorous"], uz: "Tirik o'lim damlamasi", ru: "Напиток живой смерти", en: "Draught of Living Death" },
    wit:        { c: "#e0b25b", r: ["scarab", "ginger", "armadillo"], uz: "Aqlni charxlovchi damlama", ru: "Зелье остроты ума", en: "Wit-Sharpening Potion" },
    peace:      { c: "#b7c7d9", r: ["moonstone", "hellebore", "quills", "unicorn"], uz: "Tinchlik damlamasi", ru: "Умиротворяющий бальзам", en: "Draught of Peace" },
    polyjuice:  { c: "#8a8f4a", r: ["lacewing", "leech", "bicorn", "boomslang", "hair"], uz: "Ko'p qiyofali damlama", ru: "Оборотное зелье", en: "Polyjuice Potion" },
    felix:      { c: "#f3d58f", r: ["ashwinder", "horseradish", "squill", "murtlap", "thyme"], uz: "Feliks Felitsis", ru: "Феликс Фелицис", en: "Felix Felicis" }
  };
  var IK_XATO = 3;
  var ik = null;      // {id, phase: "rec"|"cook"|"done", step, err, chips, bajar}

  // Masalliq rasmi (img/masalliq/<kod>.webp) + nomi
  function ikMas(el, m) {
    var im = document.createElement("img");
    im.className = "ik-mi";
    im.alt = "";
    im.src = IMG_DIR + "masalliq/" + m + ".webp";
    im.onerror = function () { im.style.display = "none"; };
    el.appendChild(im);
    el.appendChild(drEl("span", "", ikNom(m)));
    return el;
  }
  function ikNom(m) { var i = lang === "ru" ? 1 : lang === "en" ? 2 : 0; return (IK_M[m] || [m, m, m])[i]; }

  /* Darslar rejasi (bot: hpdars.IKSIR_DARS = 36), har bosqichda o'sha 12 damlama:
       1-12  retsept xohlagancha ochiq turadi; 8 masalliq; 3 xatoda damlama buziladi
       13-24 12 masalliq; 2 xato
       25-36 IMTIHON: retsept bir necha soniya ko'rinib yopiladi; 14 masalliq; 2 xato
     Hamma bosqichda SHAM (vaqt) va BAHO: xato, buzilish va kechikish bahoni pasaytiradi; «Qoniqarli»dan past - dars o'tmaydi. */
  var IK_TARTIB = ["boils", "forget", "shrink", "antidote", "wiggenweld", "uyqu",
                   "skelegro", "living", "wit", "peace", "polyjuice", "felix"];          // bot: hpdars.DARSLAR bilan bir xil
  var IK_BOSQ = [{ chips: 8, xato: 3, sek: 5 }, { chips: 12, xato: 2, sek: 4 }, { chips: 14, xato: 2, sek: 3, yop: true }];
  function ikSnImg(k) { return IMG_DIR + "sneyp/" + k + ".webp"; }
  function ikOpen(bell, n) {
    var st = drData && drData.iksir;
    var item = bell === true ? (st && st.contest && st.contest.item) : IK_TARTIB[((n || 1) - 1) % IK_TARTIB.length];
    var id = IK[item] ? item : "boils";
    var bq = bell === true ? { chips: 10, xato: 99 } : IK_BOSQ[Math.min(Math.floor(((n || 1) - 1) / IK_TARTIB.length), IK_BOSQ.length - 1)];
    if (bell === "rek") { id = IK_TARTIB[Math.floor(Math.random() * IK_TARTIB.length)]; bq = { chips: 10, xato: 1, sek: 0, yop: true }; }
    ikStop();
    ik = { id: id, phase: "rec", step: 0, err: 0, chips: [], bq: bq, bell: bell === true, rek: bell === "rek", rekN: 0, n: n || 1,
           errJami: 0, boom: 0, t0: 0, pct: 1, lim: 0, kayf: "maslahat", yopT: 0, tm: 0 };
    var ikY = qrYordam(["flobber", "salamandra"], ik.bell || ik.rek);
    if (ikY.flobber) { ik.bq = { chips: bq.chips, xato: bq.xato + 1, sek: bq.sek, yop: bq.yop }; bq = ik.bq; }
    ik.lim = bq.sek ? Math.round((3 + IK[id].r.length * bq.sek) * 1000 * (ikY.salamandra ? 1.25 : 1)) : 0;
    drShowGame("scr-iksir");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var i = new Image(); i.src = ikSnImg(k); });
    Object.keys(IK_M).forEach(function (m) { var i = new Image(); i.src = IMG_DIR + "masalliq/" + m + ".webp"; });      // tugmalar bo'sh chiqmasin
    var x = drX(), f = drFan("iksir");
    $("ik-kick").textContent = f.nom[lang];
    $("ik-ttl").textContent = f.ust[lang];
    $("ik-today").textContent = ik.rek ? x.rekT : ik.bell ? x.bell : x.lvl(ik.n) + (bq.yop ? " · " + x.ikImt : "");
    $("ik-timer").classList.toggle("hidden", !ik.bell);
    $("ik-name").textContent = IK[id][lang] || IK[id].uz;
    ikRender();
    ikYopBosh();
  }
  function ikStop() { if (ik) { clearInterval(ik.tm); clearInterval(ik.yopTm); ik.tm = 0; ik.yopTm = 0; } }
  // Imtihon: retsept sanoq bilan o'zi yopiladi
  function ikYopBosh() {
    if (!ik || !ik.bq.yop || ik.phase !== "rec") { return; }
    var me = ik, qoldi = 4 + IK[ik.id].r.length;
    clearInterval(ik.yopTm);
    var chiz = function () { if (ik === me && ik.phase === "rec") { $("ik-go").textContent = drX().ikGo + " · " + qoldi; $("ik-rec-s").textContent = ik.msg || drX().ikYop(qoldi); } };
    chiz();
    ik.yopTm = setInterval(function () {
      if (ik !== me || ik.phase !== "rec") { clearInterval(me.yopTm); return; }
      qoldi--;
      if (qoldi <= 0) { clearInterval(me.yopTm); ik.msg = ""; ikStart(); return; }
      chiz();
    }, 1000);
  }
  // Sham: pishirish boshlangandan yonadi
  function ikSham() {
    var sh = $("ik-sham");
    if (!sh || !ik) { return; }
    sh.classList.toggle("hidden", ik.bell || ik.phase !== "cook" || !ik.lim);
    if (ik.t0) { ik.pct = Math.max(0, 1 - (Date.now() - ik.t0) / ik.lim); }
    $("ik-sham-w").style.width = (ik.pct * 100).toFixed(1) + "%";
    sh.classList.toggle("ochdi", ik.pct <= 0);
    sh.classList.toggle("oz", ik.pct > 0 && ik.pct < 0.3);
  }
  function ikKayf(k) {
    if (!ik) { return; }
    ik.kayf = k;
    ["ik-sn-im", "ik-sn-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = ikSnImg(k); } });
  }

  function ikShuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function ikStart() {
    var rec = IK[ik.id].r, boshqa = ikShuffle(Object.keys(IK_M).filter(function (m) { return rec.indexOf(m) < 0; }));
    ik.chips = ikShuffle(rec.concat(boshqa.slice(0, ik.bq.chips - rec.length)));
    ik.phase = "cook";
    ik.step = 0;
    ik.err = 0;
    ik.msg = "";
    clearInterval(ik.yopTm);
    if (ik.lim) {
      var me = ik;
      ik.t0 = Date.now(); ik.pct = 1;
      clearInterval(ik.tm);
      ik.tm = setInterval(function () { if (ik !== me || ik.phase !== "cook") { clearInterval(me.tm); return; } ikSham(); }, 100);
    }
    ikKayf("maslahat");
    ikRender();
  }

  function ikRender() {
    if (!ik) { return; }
    var x = drX(), p = IK[ik.id], rec = p.r;
    var recBox = $("ik-rec"), cook = $("ik-cook"), res = $("ik-res");
    recBox.classList.toggle("hidden", ik.phase !== "rec");
    cook.classList.toggle("hidden", ik.phase !== "cook");
    res.classList.toggle("hidden", ik.phase !== "done");
    $("ik-pot").style.setProperty("--ik", p.c);
    $("ik-pot").style.setProperty("--ik-p", (0.12 + 0.88 * ik.step / rec.length).toFixed(2));
    $("ik-pot").classList.toggle("pish", ik.phase === "cook");
    var sl = $("ik-slots");
    if (sl) {
      sl.style.setProperty("--ik-c", p.c);
      sl.innerHTML = "";
      rec.forEach(function (m, i) { sl.appendChild(drEl("i", ik.phase !== "rec" && i < ik.step ? "on" : "")); });
    }
    $("ik-pot").classList.toggle("tayyor", ik.phase === "done");
    ikSham();
    ikKayf(ik.kayf);
    if (ik.phase === "rec") {
      $("ik-rec-t").textContent = x.ikRec;
      $("ik-rec-s").textContent = ik.msg || x.ikRecS;
      $("ik-rec-s").classList.toggle("bad", !!ik.msg);
      var ol = $("ik-rec-l");
      ol.innerHTML = "";
      rec.forEach(function (m) { ol.appendChild(ikMas(drEl("li", ""), m)); });
      $("ik-go").textContent = x.ikGo;
      return;
    }
    if (ik.phase === "cook") {
      $("ik-cook-t").textContent = ik.msg || ik.okMsg || x.ikCook;
      $("ik-cook-t").classList.toggle("bad", !!ik.msg);
      $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + (ik.bell ? x.ikErr(ik.err, "∞").replace(" / ∞", "") : x.ikErr(ik.err, ik.bq.xato));
      var box = $("ik-chips");
      box.innerHTML = "";
      ik.chips.forEach(function (m) {
        var solingan = rec.indexOf(m) >= 0 && rec.indexOf(m) < ik.step;
        var b = ikMas(drEl("button", "ik-chip" + (solingan ? " in" : "")), m);
        b.type = "button";
        b.disabled = solingan;
        b.addEventListener("click", function () { ikPick(m, b); });
        box.appendChild(b);
      });
    }
  }

  function ikPick(m, btn) {
    if (!ik || ik.phase !== "cook" || ik.lock) { return; }
    var x = drX(), rec = IK[ik.id].r;
    if (rec[ik.step] === m) {
      ik.step++;
      ik.msg = "";
      ik.kayf = "yaxshi";
      if (!ik.bell && ik.step < rec.length) { ik.okMsg = x.ikTogri[ik.step % x.ikTogri.length]; }
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
      $("ik-pot").classList.remove("qayna");
      void $("ik-pot").offsetWidth;
      $("ik-pot").classList.add("qayna");
      if (ik.step >= rec.length) {
        ik.lock = true;
        ikRender();
        setTimeout(function () {
          if (!ik) { return; }
          ik.lock = false;
          if (ik.rek) {       // rekord: keyingi damlama
            ik.rekN += rec.length;
            var yid = IK_TARTIB[Math.floor(Math.random() * IK_TARTIB.length)];
            if (yid === ik.id) { yid = IK_TARTIB[(IK_TARTIB.indexOf(yid) + 1) % IK_TARTIB.length]; }
            ik.id = yid; ik.phase = "rec"; ik.step = 0; ik.err = 0; ik.msg = ""; ik.okMsg = "";
            $("ik-name").textContent = IK[yid][lang] || IK[yid].uz;
            ikRender();
            ikYopBosh();
            return;
          }
          ik.phase = "done";
          ikRender();
          if (ik.bell) { blFinish($("ik-res")); return; }
          ikEnd();
        }, 700);
        return;
      }
      ikRender();
      return;
    }
    // xato masalliq
    ik.err++;
    ik.errJami++;
    ik.okMsg = "";
    ikKayf("xafa");
    if (bl && ik.bell) { bl.xato++; }
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    btn.classList.add("xato");
    $("ik-pot").classList.remove("tutun");
    void $("ik-pot").offsetWidth;
    $("ik-pot").classList.add("tutun");
    if (ik.err >= ik.bq.xato) {
      ik.lock = true;
      setTimeout(function () {
        if (!ik) { return; }
        ik.lock = false;
        if (ik.rek) {
          var isc = ik.rekN + ik.step;
          ikStop();
          $("ik-rec").classList.add("hidden"); $("ik-cook").classList.add("hidden");
          rekEnd("iksir", isc, $("ik-res"));
          return;
        }
        ik.phase = "rec";
        ik.step = 0;
        ik.boom++;
        ik.msg = x.ikBoom;
        ik.kayf = "xafa";
        ikRender();
        ikYopBosh();
      }, 700);
      return;
    }
    ik.msg = x.ikBad[Math.min(ik.err - 1, 1)];
    $("ik-cook-t").textContent = ik.msg;
    $("ik-cook-t").classList.add("bad");
    $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + (ik.bell ? x.ikErr(ik.err, "∞").replace(" / ∞", "") : x.ikErr(ik.err, ik.bq.xato));
  }

  // Dars oxiri: baho (xato -12, buzilish -15, sham o'chsa -20, ikki baravar kechiksa -40) va Professor Sneyp xulosasi
  function ikEnd() {
    var x = drX(), me = ik, daraja = ik.n, otgan = ik.t0 ? Date.now() - ik.t0 : 0;
    var kech = ik.lim && otgan > ik.lim ? (otgan > ik.lim * 2 ? 2 : 1) : 0;
    var s = Math.max(0, 100 - ik.errJami * 12 - ik.boom * 15 - kech * 20);
    var sc = { baho: s >= 85 ? 5 : s >= 70 ? 4 : s >= 50 ? 3 : s >= 30 ? 2 : 1, izoh: x.ikXato(ik.errJami) + " · " + x.ikVaqt[kech ? 1 : 0] };
    var otdi = sc.baho >= 3, box = $("ik-res");
    clearInterval(ik.tm);
    $("ik-pot").classList.toggle("tayyor", otdi);
    var show = function (yangi) {
      if (ik !== me) { return; }
      if (otdi) { drResult(box, "«" + x.ikSnB[sc.baho - 1] + "»", "iksir", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.ikSnB[sc.baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { ikOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { ik = null; fanOpen("iksir"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = ikSnImg(sc.baho >= 5 ? "zor" : sc.baho === 4 ? "yaxshi" : sc.baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.ikSnN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("iksir", daraja, sc.baho); drDone("iksir", daraja, show); } else { show(null); }
  }

  /* ================= QORA KUCHLARDAN HIMOYA: xavf yetib kelguncha to'g'ri afsunni tanlash =================
     Darslar rejasi (bot: hpdars.HIMOYA_DARS = 36): 1-darsda uch xavf, 2-10-darslarda bittadan yangi xavf qo'shiladi (jami 12);
     dars oshgani sari xavflar ko'payadi (5 -> 10) va tezlashadi (7 s -> 2,4 s); 25-darsdan 6 variant. Uch «jon» (qalqon):
     xato tanlov yoki kechikish bittasini oladi, tugasa dars o'tmaydi. Bellashuv: 8 xavf, jon yo'q, xato va kechikish +3 s. */
  var HM = {
    dementor: { s: "patronum", x: [], uz: ["Dementor", "Dementor yaqinlashmoqda — havo muzlab ketdi!"], ru: ["Дементор", "Приближается дементор — воздух леденеет!"], en: ["Dementor", "A Dementor is closing in — the air turns icy!"] },
    boggart:  { s: "riddikulus", x: [], uz: ["Boggart", "Shkafdan boggart otilib chiqdi!"], ru: ["Боггарт", "Из шкафа вырвался боггарт!"], en: ["Boggart", "A Boggart bursts out of the wardrobe!"] },
    curse:    { s: "protego", x: [], uz: ["La'nat", "Sizga qarab la'nat uchib kelyapti!"], ru: ["Проклятие", "В вас летит проклятие!"], en: ["Curse", "A curse is flying straight at you!"] },
    duelist:  { s: "expelliarmus", x: ["stupefy"], uz: ["Qora sehrgar", "Qora sehrgar tayoqchasini sizga o'qtaldi!"], ru: ["Тёмный волшебник", "Тёмный волшебник навёл на вас палочку!"], en: ["Dark wizard", "A Dark wizard aims a wand at you!"] },
    dark:     { s: "lumos", x: [], uz: ["Zulmat", "Atrof zim-ziyo — qorong'ida kimdir bor!"], ru: ["Тьма", "Кромешная тьма — в ней кто-то есть!"], en: ["Darkness", "Pitch darkness — something is in there!"] },
    troll:    { s: "leviosa", x: ["stupefy", "reducto"], uz: ["Tog' troli", "Trol to'qmog'ini boshingiz uzra ko'tardi!"], ru: ["Горный тролль", "Тролль занёс дубину над вашей головой!"], en: ["Mountain troll", "The troll raises its club above your head!"] },
    fire:     { s: "aguamenti", x: [], uz: ["Yong'in", "Olov pardalarga o'tib ketdi!"], ru: ["Пожар", "Огонь перекинулся на шторы!"], en: ["Fire", "The fire has caught the curtains!"] },
    pixies:   { s: "immobulus", x: ["stupefy"], uz: ["Piksilar", "Bir gala piksi sizga tashlandi!"], ru: ["Пикси", "На вас летит стая пикси!"], en: ["Pixies", "A swarm of pixies dives at you!"] },
    inferi:   { s: "incendio", x: [], uz: ["Inferiylar", "Ko'ldan inferiylar chiqib kelyapti!"], ru: ["Инферналы", "Из озера поднимаются инферналы!"], en: ["Inferi", "Inferi are rising from the lake!"] },
    spider:   { s: "arania", x: ["stupefy", "incendio"], uz: ["Akromantula", "Ulkan o'rgimchak sizga yaqinlashmoqda!"], ru: ["Акромантул", "К вам ползёт гигантский паук!"], en: ["Acromantula", "A giant spider is creeping toward you!"] },
    rock:     { s: "reducto", x: ["protego", "leviosa"], uz: ["Ko'chki", "Shiftdan toshlar qulab tushyapti!"], ru: ["Обвал", "С потолка падают камни!"], en: ["Rockfall", "Rocks are falling from the ceiling!"] },
    attacker: { s: "stupefy", x: ["expelliarmus"], uz: ["Hujumchi", "Raqib sizga qarab yugurib kelyapti!"], ru: ["Нападающий", "Противник бежит прямо на вас!"], en: ["Attacker", "An enemy is running straight at you!"] }
  };
  var HM_TARTIB = ["dementor", "boggart", "curse", "duelist", "dark", "troll", "fire", "pixies", "inferi", "spider", "rock", "attacker"];     // bot: hpdars.DARSLAR bilan bir xil
  var HM_AF = { immobulus: ["Immobilus", "Иммобулюс", "Immobulus"], arania: ["Araniya Ekzumay", "Арания Экзумай", "Arania Exumai"] };      // Afsunlar darsida yo'q afsunlar
  var hm = null;      // {n, bell, waves, i, lives, wrong, late, tSum, lim, opts, t0, tm, lock}

  function hmAf(id) { return AF[id] ? (AF[id][lang] || AF[id].uz)[0] : (HM_AF[id] || [id, id, id])[lang === "ru" ? 1 : lang === "en" ? 2 : 0]; }
  function hmTx(id) { return HM[id][lang] || HM[id].uz; }
  function hmImg(id) { return IMG_DIR + "himoya/" + id + ".webp"; }
  function hmLpImg(k) { return IMG_DIR + "lyupin/" + k + ".webp"; }
  function hmPlan(n) {
    var T = HM_TARTIB, pool = T.slice(0, Math.min(T.length, n + 2)), soni = 5 + Math.min(5, Math.floor((n - 1) / 6)), w = [], g = 0;
    var yangi = n === 1 ? T.slice(0, 3) : n + 1 < T.length ? [T[n + 1]] : [];
    if (yangi.length) { w.push(yangi[yangi.length - 1]); }
    while (w.length < soni && g < 500) { var c = pool[Math.floor(afRnd(n * 53 + g++) * pool.length)]; if (c !== w[w.length - 1]) { w.push(c); } }
    return { waves: w, lim: Math.round(Math.max(2400, 7000 - (n - 1) * 131)), opts: n > 24 ? 6 : 4, yangi: yangi };
  }
  function hmBellPlan(item) {
    var T = HM_TARTIB, urug = 0, w = [], g = 0, i;
    for (i = 0; i < String(item).length; i++) { urug += String(item).charCodeAt(i) * (i + 3); }
    if (HM[item]) { w.push(item); }
    while (w.length < 8 && g < 500) { var c = T[Math.floor(afRnd(urug + g++) * T.length)]; if (c !== w[w.length - 1]) { w.push(c); } }
    return { waves: w, lim: 6000, opts: 4, yangi: [] };
  }
  function hmRekPlan() {
    var w = [];
    while (w.length < 300) { var c = HM_TARTIB[Math.floor(Math.random() * HM_TARTIB.length)]; if (c !== w[w.length - 1]) { w.push(c); } }
    return { waves: w, lim: 5000, opts: 4, yangi: [] };
  }
  function hmStop() { if (hm) { clearInterval(hm.tm); hm.tm = 0; } }
  function hmKayf(k) { ["hm-lp-im", "hm-lp-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = hmLpImg(k); } }); }

  function hmOpen(bell, n) {
    var st = drData && drData.himoya, x = drX(), f = drFan("himoya");
    var plan = bell === "rek" ? hmRekPlan() : bell === true ? hmBellPlan(st && st.contest && st.contest.item) : hmPlan(n || 1);
    hmStop();
    hm = { n: n || 1, bell: bell === true, rek: bell === "rek", waves: plan.waves, lim: plan.lim, opts: plan.opts, yangi: plan.yangi,
           i: 0, lives: 3, jon: 3, wrong: 0, late: 0, tSum: 0, t0: 0, tm: 0, lock: false };
    var hmY = qrYordam(["testral", "mushuk"], hm.bell || hm.rek);
    if (hm.rek) { hm.lives = hm.jon = 1; }
    if (hmY.testral) { hm.lives = hm.jon = 4; }
    if (hmY.mushuk) { hm.opts = Math.max(2, hm.opts - 1); }
    drShowGame("scr-himoya");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var im = new Image(); im.src = hmLpImg(k); });
    plan.waves.forEach(function (id) { var im = new Image(); im.src = hmImg(id); });
    $("hm-kick").textContent = { uz: "Himoya darsi", ru: "Урок защиты", en: "Defence class" }[lang] || f.nom[lang];
    $("hm-ttl").textContent = f.ust[lang];
    $("hm-today").textContent = hm.rek ? x.rekT : hm.bell ? x.bell : x.lvl(hm.n);
    $("hm-name").textContent = f.nom[lang];
    $("hm-desc").textContent = "";
    $("hm-res").classList.add("hidden");
    $("hm-stage").classList.add("hidden");
    $("hm-intro").classList.toggle("hidden", hm.bell || hm.rek);
    if (hm.bell || hm.rek) { hmGo(); return; }
    // kirish: yangi xavf(lar) va unga qarshi afsun
    var box = $("hm-new");
    box.innerHTML = "";
    hm.yangi.forEach(function (id) {
      var r = drEl("div", "hm-nw"), im = document.createElement("img");
      im.alt = ""; im.src = hmImg(id);
      r.appendChild(im);
      var t = drEl("span", "hm-nw-t");
      t.appendChild(drEl("b", "", hmTx(id)[0]));
      t.appendChild(drEl("small", "", hmAf(HM[id].s)));
      r.appendChild(t);
      box.appendChild(r);
    });
    $("hm-intro-t").textContent = hm.yangi.length ? x.hmNew : x.hmOld;
    $("hm-go").textContent = x.hmGo;
    hmKayf("maslahat");
  }

  function hmGo() {
    $("hm-intro").classList.add("hidden");
    $("hm-stage").classList.remove("hidden");
    $("hm-lives").classList.toggle("hidden", hm.bell || hm.rek);
    hm.i = 0;
    hmWave();
  }

  function hmLives() {
    var el = $("hm-lives");
    el.innerHTML = "";
    for (var i = 0; i < (hm.jon || 3); i++) { el.appendChild(drEl("i", i < hm.lives ? "on" : "")); }
  }
  function hmHead() {
    var x = drX();
    $("hm-step").textContent = (hm.rek ? x.rekT + " · " + hm.i : x.hmStep(Math.min(hm.i + 1, hm.waves.length), hm.waves.length)) + (bl && hm.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
  }

  // Navbatdagi xavf: rasm uzoqdan yaqinlashadi, sham yonadi, variantlar chiqadi
  function hmWave() {
    if (hm.rek) { hm.lim = Math.max(1500, 5000 - hm.i * 110); hm.opts = hm.i >= 15 ? 6 : 4; }
    var x = drX(), me = hm, id = hm.waves[hm.i], t = HM[id], box = $("hm-opts"), ids = [t.s], g = 0;
    var hammasi = HM_TARTIB.map(function (k) { return HM[k].s; });
    while (ids.length < hm.opts && g < 300) {
      var c = hammasi[Math.floor(afRnd(hm.n * 29 + hm.i * 13 + g++ + (hm.bell ? 700 : 0)) * hammasi.length)];
      if (ids.indexOf(c) < 0 && t.x.indexOf(c) < 0) { ids.push(c); }
    }
    ids.sort(function () { return Math.random() - 0.5; });
    hm.lock = false;
    $("hm-name").textContent = hmTx(id)[0];
    $("hm-desc").textContent = hmTx(id)[1];
    $("hm-box").className = "hm-box";
    $("hm-im").src = hmImg(id);
    $("hm-im").style.transform = "scale(.42)";
    $("hm-hint").textContent = x.hmHint;
    $("hm-hint").classList.remove("bad");
    hmKayf("maslahat");
    hmLives();
    hmHead();
    box.innerHTML = "";
    ids.forEach(function (af) {
      var b = drEl("button", "tr-o", hmAf(af));
      b.type = "button";
      b.addEventListener("click", function () { hmPick(af, b); });
      box.appendChild(b);
    });
    hm.t0 = Date.now();
    clearInterval(hm.tm);
    hm.tm = setInterval(function () {
      if (hm !== me || $("scr-himoya").classList.contains("hidden")) { clearInterval(me.tm); return; }
      if (hm.lock) { return; }
      var p = Math.min(1, (Date.now() - hm.t0) / hm.lim);
      $("hm-im").style.transform = "scale(" + (0.42 + 0.58 * p).toFixed(3) + ")";
      $("hm-sham-w").style.width = ((1 - p) * 100).toFixed(1) + "%";
      $("hm-sham").classList.toggle("oz", p > 0.7 && p < 1);
      $("hm-sham").classList.toggle("ochdi", p >= 1);
      if (hm.bell) { hmHead(); }
      if (p >= 1) { hmMiss(true); }
    }, 50);
  }

  // Jon ketdi (kechikish - keyingi xavfga o'tadi; xato tanlov - shu xavf davom etadi)
  function hmMiss(kech) {
    var x = drX(), me = hm;
    if (kech) { hm.late++; } else { hm.wrong++; }
    if (bl && hm.bell) { bl.xato++; } else { hm.lives--; }
    hmLives();
    hmKayf("xafa");
    $("hm-hint").textContent = kech ? x.hmLate : x.hmBad;
    $("hm-hint").classList.add("bad");
    $("hm-box").classList.remove("zarba");
    void $("hm-box").offsetWidth;
    $("hm-box").classList.add("zarba");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    if (!hm.bell && hm.lives <= 0) { hm.lock = true; clearInterval(hm.tm); setTimeout(function () { if (hm === me) { hmEnd(); } }, 800); return; }
    if (kech) {
      hm.lock = true;
      hm.tSum += 1;
      setTimeout(function () { if (hm === me) { hmNext(); } }, 800);
    }
  }
  function hmNext() {
    hm.i++;
    if (hm.i >= hm.waves.length) { hmEnd(); return; }
    hmWave();
  }
  function hmPick(af, btn) {
    if (!hm || hm.lock || btn.classList.contains("xato")) { return; }
    var x = drX(), me = hm, id = hm.waves[hm.i];
    if (af !== HM[id].s) { btn.classList.add("xato"); hmMiss(false); return; }
    hm.lock = true;
    hm.tSum += Math.min(1, (Date.now() - hm.t0) / hm.lim);
    btn.classList.add("togri");
    $("hm-box").classList.add("urildi");
    $("hm-hint").textContent = x.hmOk[hm.i % x.hmOk.length];
    $("hm-hint").classList.remove("bad");
    hmKayf((Date.now() - hm.t0) / hm.lim < 0.5 ? "zor" : "yaxshi");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    setTimeout(function () { if (hm === me) { hmNext(); } }, 650);
  }

  // Dars oxiri: baho (xato -12, kechikish -15, sekin javob -10) va Professor Lyupin xulosasi
  function hmEnd() {
    var x = drX(), me = hm, daraja = hm.n, box = $("hm-res");
    clearInterval(hm.tm);
    $("hm-stage").classList.add("hidden");
    $("hm-name").textContent = drFan("himoya").nom[lang];
    $("hm-desc").textContent = "";
    if (hm.rek) { rekEnd("himoya", hm.i, box); return; }
    if (hm.bell) { blFinish(box); return; }
    var s = Math.max(0, 100 - hm.wrong * 12 - hm.late * 15 - (hm.tSum / hm.waves.length > 0.75 ? 10 : 0));
    var baho = s >= 85 ? 5 : s >= 70 ? 4 : s >= 50 ? 3 : s >= 30 ? 2 : 1;
    if (hm.lives <= 0) { baho = Math.min(baho, 2); }
    var sc = { baho: baho, izoh: x.hmStat(hm.wrong, hm.late) }, otdi = baho >= 3;
    var show = function (yangi) {
      if (hm !== me) { return; }
      if (otdi) { drResult(box, "«" + x.hmLpB[baho - 1] + "»", "himoya", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.hmLpB[baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { hmOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { hm = null; fanOpen("himoya"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = hmLpImg(baho >= 5 ? "zor" : baho === 4 ? "yaxshi" : baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.hmLpN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("himoya", daraja, baho); drDone("himoya", daraja, show); } else { show(null); }
  }

  /* ================= UCHISH DARSI: supurgida halqalardan o'tish =================
     Supurgi oldinga o'zi uchadi, barmoq uni o'ngga-chapga suradi. Halqalar uzoqdan kattalashib keladi: o'rtasidan o'tilsa
     hisoblanadi va ketma-ket o'tish tezlikni oshiradi (x1,48 gacha). 4-darsdan BLADJERLAR (urilsa jon ketadi, uchta jon),
     7-darsdan oltin SNITCH (tutilsa bahoga +8). Dars oshgani sari halqalar ko'payadi (10 -> 21), torayadi va tezlik oshadi.
     Bot: hpdars.UCHISH_DARS = 36. Bellashuv: shu kungi yo'nalish (urug' - mavzu nomidan), o'tkazilgan halqa va zarba +3 s;
     tez uchgan (ketma-ket halqalar) vaqtdan yutadi. */
  var uch = null, UCH_IM = {};
  function uchImg(k) {
    if (!UCH_IM[k]) { var i = new Image(); i.src = IMG_DIR + "uchish/" + k + (k === "fon" ? ".jpg" : ".webp"); UCH_IM[k] = i; }
    return UCH_IM[k];
  }
  function uchBor(im) { return im && im.complete && im.naturalWidth > 0; }
  function uchXcImg(k) { return IMG_DIR + "xuch/" + k + ".webp"; }
  function uchKayf(k) { ["uc-xc-im", "uc-xc-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = uchXcImg(k); } }); }
  function uchPlan(n, urug, rek) {
    var bell = urug != null, s0 = rek ? Math.floor(Math.random() * 90000) : bell ? urug : n * 71, R = rek ? 300 : bell ? 14 : 10 + Math.floor((n - 1) / 3);
    var bld = rek ? 70 : bell ? 5 : n < 4 ? 0 : Math.min(8, 1 + Math.floor((n - 4) / 4)), qadam = rek ? 0.4 : bell ? 0.42 : Math.min(0.5, 0.26 + n * 0.008);
    var objs = [], x = 0.5, i, k;
    for (i = 0; i < R; i++) {
      x = Math.max(0.12, Math.min(0.88, x + (afRnd(s0 + i * 3) - 0.5) * 2 * qadam));
      objs.push({ t: "ring", d: 1.6 + i, x: x });
    }
    for (i = 0; i < bld; i++) {
      k = 1 + Math.floor(afRnd(s0 + 500 + i * 7) * (R - 2));
      objs.push({ t: "bld", d: objs[k].d + 0.5, x: Math.max(0.1, Math.min(0.9, (objs[k].x + objs[k + 1].x) / 2 + (afRnd(s0 + 600 + i) - 0.5) * 0.24)) });
    }
    if (bell || n >= 7) { objs.push({ t: "sn", d: 1.6 + Math.floor((0.4 + 0.35 * afRnd(s0 + 900)) * R) + 0.5, x: 0.3 + 0.4 * afRnd(s0 + 901), ph: afRnd(s0 + 902) * 6 }); }
    return { objs: objs, R: R, len: 1.6 + R + 0.5, v0: bell ? 0.62 : 0.5 + n * 0.008, rr: bell ? 0.13 : Math.max(0.1, 0.15 - n * 0.0014) };
  }
  function uchStop() { if (uch) { uch.over = true; try { cancelAnimationFrame(uch.raf); } catch (e) {} } }

  function uchOpen(bell, n) {
    var st = drData && drData.uchish, x = drX(), f = drFan("uchish"), urug = null, i;
    if (bell === true) { var it = String((st && st.contest && st.contest.item) || "y1"); urug = 0; for (i = 0; i < it.length; i++) { urug += it.charCodeAt(i) * (i + 7); } }
    var plan = uchPlan(n || 1, urug, bell === "rek");
    uchStop();
    uch = { n: n || 1, bell: bell === true, rek: bell === "rek", objs: plan.objs, R: plan.R, len: plan.len, v0: plan.v0, rr: plan.rr,
            dist: 0, rx: 0.5, tx: 0.5, combo: 0, slow: 0, pass: 0, miss: 0, hits: 0, lives: 3, snitch: false, seen: 0,
            ts: 0, raf: 0, over: false, hitAt: 0, snAt: 0, w: 320, h: 400, dpr: 1 };
    if (qrYordam(["gippo"], uch.bell || uch.rek).gippo) { uch.lives = uch.jon = 4; }
    drShowGame("scr-uchish");
    // uchuvchining kiyimi o'z fakulteti rangida (egasi, 2026-10-08)
    var uy = "gryffindor";
    try { uy = validHouse(cupMe().house || house) || uy; } catch (e) {}
    uch.rider = "rider-" + uy;
    [uch.rider, "snitch", "bludger", "fon"].forEach(uchImg);
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var im = new Image(); im.src = uchXcImg(k); });
    $("uc-kick").textContent = f.nom[lang];
    $("uc-ttl").textContent = f.ust[lang];
    $("uc-today").textContent = uch.rek ? x.rekT : uch.bell ? x.bell : x.lvl(uch.n);
    $("uc-res").classList.add("hidden");
    $("uc-stage").classList.add("hidden");
    $("uc-intro").classList.toggle("hidden", uch.bell || uch.rek);
    if (uch.bell || uch.rek) { uchGo(); return; }
    $("uc-intro-t").textContent = x.ucIntro[uch.n === 1 ? 0 : uch.n === 4 ? 1 : uch.n === 7 ? 2 : 3];
    $("uc-go").textContent = x.ucGo;
    uchKayf("maslahat");
  }

  function uchGo() {
    var x = drX(), c = $("uc-canvas");
    $("uc-intro").classList.add("hidden");
    $("uc-stage").classList.remove("hidden");
    $("uc-lives").classList.toggle("hidden", uch.bell || uch.rek);
    var w = Math.min(c.parentNode.clientWidth || 320, 360), h = Math.round(w * 1.18), dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.style.width = w + "px"; c.style.height = h + "px";
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    uch.w = w; uch.h = h; uch.dpr = dpr;
    uch.over = false;
    uch.ts = 0;
    $("uc-hint").textContent = x.ucHint;
    $("uc-hint").classList.remove("bad");
    uchKayf("maslahat");
    uchHud();
    uch.raf = requestAnimationFrame(uchTick);
  }
  function uchHud() {
    var x = drX(), el = $("uc-lives"), mult = 1 + Math.min(uch.combo, 6) * 0.08;
    el.innerHTML = "";
    for (var i = 0; i < (uch.jon || 3); i++) { el.appendChild(drEl("i", i < uch.lives ? "on" : "")); }
    $("uc-step").textContent = (uch.rek ? x.rekT + " · " + uch.pass : x.ucStep(Math.min(uch.seen + 1, uch.R), uch.R) + (mult > 1 ? " · ×" + mult.toFixed(2) : "")) +
      (bl && uch.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
  }
  function uchDe(matn, kayf, bad) {
    $("uc-hint").textContent = matn;
    $("uc-hint").classList.toggle("bad", !!bad);
    uchKayf(kayf);
  }

  function uchTick(ts) {
    if (!uch || uch.over) { return; }
    if ($("scr-uchish").classList.contains("hidden")) { uch.over = true; return; }
    var x = drX(), me = uch, dt = uch.ts ? Math.min(0.05, (ts - uch.ts) / 1000) : 0;
    uch.ts = ts;
    uch.rx += (uch.tx - uch.rx) * Math.min(1, dt * 11);
    uch.slow -= dt;
    uch.dist += (uch.rek ? 0.5 + Math.min(0.55, uch.pass * 0.012) : uch.v0 * (uch.slow > 0 ? 0.6 : 1 + Math.min(uch.combo, 6) * 0.08)) * dt;
    var ozgardi = false;
    uch.objs.forEach(function (o) {
      o.cx = o.t === "sn" ? o.x + Math.sin(uch.dist * 5 + o.ph) * 0.22 : o.x;
      if (o.done || o.d > uch.dist) { return; }
      o.done = true; o.at = ts; ozgardi = true;
      var dx = Math.abs(o.cx - uch.rx);
      if (o.t === "ring") {
        uch.seen++;
        if (dx < uch.rr) {
          o.ok = true; uch.pass++; uch.combo++;
          uchDe(x.ucOk[uch.pass % x.ucOk.length], uch.combo >= 3 ? "zor" : "yaxshi");
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
        } else {
          o.ok = false; uch.miss++; uch.combo = 0;
          if (bl && uch.bell) { bl.xato++; }
          uchDe(x.ucMiss, "maslahat", true);
        }
      } else if (o.t === "bld") {
        if (dx < 0.09) {
          o.hit = true; uch.hits++; uch.combo = 0; uch.slow = 0.8; uch.hitAt = ts;
          if (bl && uch.bell) { bl.xato++; } else { uch.lives--; }
          uchDe(x.ucHit, "xafa", true);
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
        }
      } else if (dx < 0.12) {
        o.hit = true; uch.snitch = true; uch.snAt = ts;
        uchDe(x.ucSn, "zor");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
      }
    });
    if (ozgardi || uch.bell) { uchHud(); }
    uchPaint(ts);
    if (uch.dist > uch.len || (!uch.bell && uch.lives <= 0) || (uch.rek && (uch.miss > 0 || uch.hits > 0))) {
      uch.over = true;
      setTimeout(function () { if (uch === me) { uchEnd(); } }, 500);
      return;
    }
    uch.raf = requestAnimationFrame(uchTick);
  }

  function uchPaint(ts) {
    var c = $("uc-canvas"), g = c.getContext("2d"), w = uch.w, h = uch.h, ry = h * 0.8, W = w * 0.84, ppu = h * 0.62, i, im;
    var sc = function (y) { return 0.38 + 0.62 * Math.max(0, Math.min(1.12, y / ry)); };
    var px = function (o) { return w / 2 + (o.cx - 0.5) * W * sc(o.y); };
    g.setTransform(uch.dpr, 0, 0, uch.dpr, 0, 0);
    // fon (ozgina siljiydi) va tezlik chiziqlari
    im = uchImg("fon");
    if (uchBor(im)) {
      var k = Math.max((w + 40) / im.naturalWidth, h / im.naturalHeight), fw = im.naturalWidth * k, fh = im.naturalHeight * k;
      g.drawImage(im, (w - fw) / 2 + (0.5 - uch.rx) * 28, (h - fh) / 2, fw, fh);
    } else {
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#1b1f3a"); gr.addColorStop(0.7, "#5a3a5e"); gr.addColorStop(1, "#1a2a22");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }
    g.fillStyle = "rgba(8,10,16,.3)"; g.fillRect(0, 0, w, h);
    var tez = uch.slow > 0 ? 0.6 : 1 + Math.min(uch.combo, 6) * 0.08;
    g.lineCap = "round";
    for (i = 0; i < 14; i++) {
      var lx = afRnd(i) * w, ly = ((afRnd(i + 30) * h + uch.dist * ppu * (0.7 + afRnd(i + 60))) % (h + 80)) - 40;
      g.strokeStyle = "rgba(255,255,255," + (0.07 + 0.06 * (tez - 1) * 4).toFixed(3) + ")"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx, ly + 22 * tez); g.stroke();
    }
    var chiz = function (o) {
      var s = sc(o.y), ox = px(o), a;
      if (o.t === "ring") {
        var rxp = uch.rr * W * 1.45 * s, ryp = rxp * 0.42;
        a = o.done ? Math.max(0, 1 - (ts - o.at) / 450) : Math.min(1, (o.y + 60) / 120);
        if (a <= 0) { return; }
        g.globalAlpha = a;
        g.lineWidth = 9 * s + 2; g.strokeStyle = "#0a0c10";
        g.beginPath(); g.ellipse(ox, o.y, rxp, ryp, 0, 0, Math.PI * 2); g.stroke();
        g.lineWidth = 5 * s + 1;
        g.strokeStyle = o.done ? (o.ok ? "#8be28f" : "#f0786c") : "#f3d58f";
        g.shadowColor = o.done ? (o.ok ? "rgba(139,226,143,.9)" : "rgba(240,120,108,.8)") : "rgba(243,213,143,.7)"; g.shadowBlur = 12 * s;
        g.beginPath(); g.ellipse(ox, o.y, rxp, ryp, 0, 0, Math.PI * 2); g.stroke();
        g.shadowBlur = 0; g.globalAlpha = 1;
      } else {
        if (o.done && (o.hit || ts - o.at > 500)) { return; }
        var sp = uchImg(o.t === "sn" ? "snitch" : "bludger"), o2 = (o.t === "sn" ? 62 : 50) * s;
        if (o.t === "sn") { afGlow(g, ox, o.y, o2 * 0.9, "243,213,143", 0.55); }
        if (uchBor(sp)) {
          g.save(); g.translate(ox, o.y); if (o.t === "bld") { g.rotate(uch.dist * 4); }
          var dw = o2 * (o.t === "sn" ? 1.7 : 1), dh = dw * sp.naturalHeight / sp.naturalWidth;
          g.drawImage(sp, -dw / 2, -dh / 2, dw, dh); g.restore();
        } else {
          g.fillStyle = o.t === "sn" ? "#f3d58f" : "#1a1c22"; g.strokeStyle = "#07090d"; g.lineWidth = 3;
          g.beginPath(); g.arc(ox, o.y, o2 * 0.3, 0, Math.PI * 2); g.fill(); g.stroke();
        }
      }
    };
    var kor = uch.objs.filter(function (o) { o.y = ry - (o.d - uch.dist) * ppu; return o.y > -70 && o.y < h + 90; }).sort(function (p, q) { return p.y - q.y; });
    kor.forEach(function (o) { if (o.y < ry) { chiz(o); } });
    // supurgidagi o'quvchi
    var rxp2 = w / 2 + (uch.rx - 0.5) * W, burilish = Math.max(-0.45, Math.min(0.45, (uch.tx - uch.rx) * 2.4));
    im = uchImg(uch.rider);
    g.save(); g.translate(rxp2, ry); g.rotate(burilish);
    if (uchBor(im)) { var rh = 104, rw = rh * im.naturalWidth / im.naturalHeight; g.drawImage(im, -rw / 2, -rh * 0.55, rw, rh); }
    else { g.fillStyle = "#b5382e"; g.strokeStyle = "#07090d"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -30); g.lineTo(20, 26); g.lineTo(-20, 26); g.closePath(); g.fill(); g.stroke(); }
    g.restore();
    kor.forEach(function (o) { if (o.y >= ry) { chiz(o); } });
    if (ts - uch.hitAt < 320) { g.fillStyle = "rgba(240,80,70," + (0.45 * (1 - (ts - uch.hitAt) / 320)).toFixed(3) + ")"; g.fillRect(0, 0, w, h); }
    if (uch.snAt && ts - uch.snAt < 500) { g.fillStyle = "rgba(243,213,143," + (0.5 * (1 - (ts - uch.snAt) / 500)).toFixed(3) + ")"; g.fillRect(0, 0, w, h); }
  }

  // Dars oxiri: baho = o'tilgan halqalar ulushi - zarbalar (har biri 8) + Snitch (8); o'tish - kamida «Qoniqarli» (60)
  function uchEnd() {
    var x = drX(), me = uch, daraja = uch.n, box = $("uc-res");
    $("uc-stage").classList.add("hidden");
    if (uch.rek) { rekEnd("uchish", uch.pass, box); return; }
    if (uch.bell) { blFinish(box); return; }
    var s = Math.round(100 * uch.pass / uch.R) - uch.hits * 8 + (uch.snitch ? 8 : 0);
    var baho = s >= 90 ? 5 : s >= 78 ? 4 : s >= 60 ? 3 : s >= 40 ? 2 : 1;
    if (uch.lives <= 0) { baho = Math.min(baho, 2); }
    var sc = { baho: baho, izoh: x.ucStat(uch.pass, uch.R, uch.hits, uch.snitch) }, otdi = baho >= 3;
    var show = function (yangi) {
      if (uch !== me) { return; }
      if (otdi) { drResult(box, "«" + x.ucXcB[baho - 1] + "»", "uchish", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.ucXcB[baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { uchOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { uch = null; fanOpen("uchish"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = uchXcImg(baho >= 5 ? "zor" : baho === 4 ? "yaxshi" : baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.ucXcN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("uchish", daraja, baho); drDone("uchish", daraja, show); } else { show(null); }
  }

  /* ================= SEHRLI MAXLUQLAR PARVARISHI: maxluqni o'z yemishi bilan juftlash (xotira o'yini) =================
     Kartalar yuzi pastga qaragan: ikkitasini ochasiz - maxluq va UNING yemishi bo'lsa juftlik topildi. 12 maxluq (asardagi
     yemishi bilan); 1-darsda uchta, 2-10-darslarda bittadan yangisi (dars boshida Xagrid ko'rsatadi).
     Darslar (bot: hpdars.MAXLUQ_DARS = 36): 1-4 - 3 juftlik, 5-12 - 4 juftlik (boshida kartalar 4 s ochiq turadi);
     13-24 - 6 juftlik (2,5 s); 25-36 - 8 juftlik, oldindan ko'rsatilmaydi. Sham = vaqt. Baho: ortiqcha xato juftlik -10,
     kechikish -20/-40. Bellashuv: 6 juftlik, joylashuvi hammaga bir xil (urug' - mavzudan), xato juftlik +3 s. */
  var MX = {
    gippo:      { uz: ["Gippogrif", "O'lik suvsar"], ru: ["Гиппогриф", "Дохлый хорёк"], en: ["Hippogriff", "Dead ferret"] },
    boyogli:    { uz: ["Boyo'g'li", "Sichqon"], ru: ["Сова", "Мышь"], en: ["Owl", "Mouse"] },
    niffler:    { uz: ["Niffler", "Yaltiroq tangalar"], ru: ["Нюхлер", "Блестящие монеты"], en: ["Niffler", "Shiny coins"] },
    flobber:    { uz: ["Flobber-qurt", "Salat bargi"], ru: ["Флоббер-червь", "Лист салата"], en: ["Flobberworm", "Lettuce"] },
    testral:    { uz: ["Testral", "Xom go'sht"], ru: ["Фестрал", "Сырое мясо"], en: ["Thestral", "Raw meat"] },
    qurbaqa:    { uz: ["Qurbaqa", "Pashshalar"], ru: ["Жаба", "Мухи"], en: ["Toad", "Flies"] },
    ajdar:      { uz: ["Ajdar bolasi", "Tovuq qoni va brendi"], ru: ["Детёныш дракона", "Куриная кровь с бренди"], en: ["Baby dragon", "Chicken blood and brandy"] },
    kalmar:     { uz: ["Ulkan kalmar", "Tost"], ru: ["Гигантский кальмар", "Тост"], en: ["Giant squid", "Toast"] },
    boutrakl:   { uz: ["Boutrakl", "Yog'och bitlari"], ru: ["Лукотрус", "Мокрицы"], en: ["Bowtruckle", "Woodlice"] },
    salamandra: { uz: ["Salamandra", "Achchiq qalampir"], ru: ["Саламандра", "Острый перец"], en: ["Salamander", "Chilli pepper"] },
    mushuk:     { uz: ["Kniazl", "Baliq"], ru: ["Жмыр", "Рыба"], en: ["Kneazle", "Fish"] },
    kalamush:   { uz: ["Kalamush", "Pishloq"], ru: ["Крыса", "Сыр"], en: ["Rat", "Cheese"] }
  };
  var MX_TARTIB = ["gippo", "boyogli", "niffler", "flobber", "testral", "qurbaqa", "ajdar", "kalmar", "boutrakl", "salamandra", "mushuk", "kalamush"];
  var mx = null;      // {n, bell, cards:[{k, f, open, done}], sel, lock, mism, found, pairs, peek, lim, t0, tm}
  function mxTx(k) { return MX[k][lang] || MX[k].uz; }
  function mxImg(k, f) { return IMG_DIR + "maxluq/" + (f ? "f-" : "") + k + ".webp"; }
  function mxXgImg(k) { return IMG_DIR + "xagrid/" + k + ".webp"; }
  function mxKayf(k) { ["mx-xg-im", "mx-xg-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = mxXgImg(k); } }); }
  function mxStop() { if (mx) { clearInterval(mx.tm); clearTimeout(mx.pk); mx.tm = 0; } }
  // Urug'li aralashtirish (bellashuvda joylashuv hammaga bir xil bo'lishi uchun)
  function mxArala(a, urug) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((urug == null ? Math.random() : afRnd(urug + i * 5)) * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function mxPlan(n, urug) {
    var bell = urug != null, T = MX_TARTIB, juft = bell ? 6 : n <= 4 ? 3 : n <= 12 ? 4 : n <= 24 ? 6 : 8;
    var pool = bell ? T.slice() : T.slice(0, Math.min(T.length, n + 2)), yangi = bell ? [] : n === 1 ? T.slice(0, 3) : n + 1 < T.length ? [T[n + 1]] : [];
    var tan = yangi.slice(0, juft), g = 0, s0 = bell ? urug : n * 37;
    while (tan.length < juft && g < 500) { var c = pool[Math.floor(afRnd(s0 + g++) * pool.length)]; if (tan.indexOf(c) < 0) { tan.push(c); } }
    var cards = [];
    tan.forEach(function (k) { cards.push({ k: k, f: false }); cards.push({ k: k, f: true }); });
    mxArala(cards, bell ? urug + 99 : null);
    return { cards: cards, juft: juft, yangi: yangi, peek: bell || n > 24 ? 0 : n > 12 ? 2500 : 4000,
             lim: bell ? 0 : Math.round(juft * (n <= 12 ? 7 : n <= 24 ? 5.5 : 4.5) * 1000) };
  }

  // Rekord: taxtalar ketma-ket (3 juftlikdan 8 gacha), kartalar bir zum ko'rsatiladi; birinchi xato juftlikda tugaydi
  function mxRekTaxta() {
    var juft = Math.min(8, 3 + Math.floor(mx.rekR / 2)), tan = mxArala(MX_TARTIB.slice(), null).slice(0, juft), cards = [];
    tan.forEach(function (k) { cards.push({ k: k, f: false }); cards.push({ k: k, f: true }); });
    mx.cards = mxArala(cards, null); mx.pairs = juft; mx.peek = Math.max(1500, 3500 - mx.rekR * 200); mx.lim = 0; mx.found = 0; mx.sel = null; mx.yangi = [];
  }
  function mxOpen(bell, n) {
    var st = drData && drData.maxluq, x = drX(), f = drFan("maxluq"), urug = null, i;
    if (bell === true) { var it = String((st && st.contest && st.contest.item) || "m1"); urug = 0; for (i = 0; i < it.length; i++) { urug += it.charCodeAt(i) * (i + 11); } }
    var plan = mxPlan(n || 1, urug);
    mxStop();
    mx = { n: n || 1, bell: bell === true, rek: bell === "rek", rekJami: 0, rekR: 0, cards: plan.cards, pairs: plan.juft, yangi: plan.yangi, peek: plan.peek, lim: plan.lim,
           sel: null, lock: false, mism: 0, found: 0, t0: 0, pct: 1, tm: 0, pk: 0 };
    if (mx.rek) { mxRekTaxta(); }
    if (qrYordam(["qurbaqa"], mx.bell || mx.rek).qurbaqa) { mx.peek = mx.peek > 0 ? mx.peek + 2000 : 1500; }
    drShowGame("scr-maxluq");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var im = new Image(); im.src = mxXgImg(k); });
    plan.cards.forEach(function (c) { var im = new Image(); im.src = mxImg(c.k, c.f); });
    $("mx-kick").textContent = { uz: "Maxluqlar parvarishi", ru: "Уход за существами", en: "Magical Creatures" }[lang] || f.nom[lang];
    $("mx-ttl").textContent = f.ust[lang];
    $("mx-today").textContent = mx.rek ? x.rekT : mx.bell ? x.bell : x.lvl(mx.n);
    $("mx-res").classList.add("hidden");
    $("mx-stage").classList.add("hidden");
    $("mx-intro").classList.toggle("hidden", mx.bell || mx.rek);
    if (mx.bell || mx.rek) { mxGo(); return; }
    var box = $("mx-new");
    box.innerHTML = "";
    mx.yangi.forEach(function (k) {
      var r = drEl("div", "hm-nw"), im = document.createElement("img"), im2 = document.createElement("img");
      im.alt = ""; im.src = mxImg(k, false);
      im2.alt = ""; im2.src = mxImg(k, true); im2.className = "mx-nw-f";
      r.appendChild(im);
      var t = drEl("span", "hm-nw-t");
      t.appendChild(drEl("b", "", mxTx(k)[0]));
      t.appendChild(drEl("small", "", mxTx(k)[1]));
      r.appendChild(t);
      r.appendChild(im2);
      box.appendChild(r);
    });
    $("mx-intro-t").textContent = mx.yangi.length ? x.mxNew : x.mxOld;
    $("mx-go").textContent = x.mxGo;
    mxKayf("maslahat");
  }

  function mxGo() {
    var x = drX(), me = mx;
    $("mx-intro").classList.add("hidden");
    $("mx-stage").classList.remove("hidden");
    $("mx-sham").classList.toggle("hidden", mx.bell || !mx.lim);
    $("mx-sham-w").style.width = "100%";
    $("mx-sham").classList.remove("ochdi", "oz");
    mxKayf("maslahat");
    mx.lock = mx.peek > 0;
    mx.cards.forEach(function (c) { c.open = mx.peek > 0; c.done = false; });
    $("mx-hint").textContent = mx.peek > 0 ? x.mxPeek : x.mxHint;
    $("mx-hint").classList.remove("bad");
    mxRender();
    var bosh = function () {
      if (mx !== me) { return; }
      mx.cards.forEach(function (c) { c.open = false; });
      mx.lock = false;
      $("mx-hint").textContent = x.mxHint;
      mxRender();
      mx.t0 = Date.now();
      clearInterval(mx.tm);
      mx.tm = setInterval(function () {
        if (mx !== me || $("scr-maxluq").classList.contains("hidden")) { clearInterval(me.tm); return; }
        if (mx.lim) {
          mx.pct = Math.max(0, 1 - (Date.now() - mx.t0) / mx.lim);
          $("mx-sham-w").style.width = (mx.pct * 100).toFixed(1) + "%";
          $("mx-sham").classList.toggle("ochdi", mx.pct <= 0);
          $("mx-sham").classList.toggle("oz", mx.pct > 0 && mx.pct < 0.3);
        }
        if (mx.bell) { mxHead(); }
      }, 100);
    };
    if (mx.peek > 0) { mx.pk = setTimeout(bosh, mx.peek); } else { bosh(); }
  }
  function mxHead() {
    var x = drX();
    $("mx-prog").textContent = (mx.rek ? x.rekT + " · " + mx.rekJami : x.mxStep(mx.found, mx.pairs)) + (bl && mx.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
  }
  function mxRender() {
    var grid = $("mx-grid");
    grid.className = "mx-grid" + (mx.pairs <= 3 ? " uch" : "");
    grid.innerHTML = "";
    mx.cards.forEach(function (c, i) {
      var b = drEl("button", "mx-c" + (c.open || c.done ? " ochiq" : "") + (c.done ? " topildi" : "")), ich = drEl("span", "mx-in");
      b.type = "button";
      var fr = drEl("span", "mx-fr" + (c.f ? " yem" : "")), im = document.createElement("img");
      im.alt = ""; im.src = mxImg(c.k, c.f);
      fr.appendChild(im);
      fr.appendChild(drEl("small", "", mxTx(c.k)[c.f ? 1 : 0]));
      ich.appendChild(drEl("span", "mx-bk"));
      ich.appendChild(fr);
      b.appendChild(ich);
      b.addEventListener("click", function () { mxPick(i); });
      c.el = b;
      grid.appendChild(b);
    });
    mxHead();
  }
  function mxPick(i) {
    if (!mx || mx.lock) { return; }
    var x = drX(), me = mx, c = mx.cards[i];
    if (c.open || c.done) { return; }
    c.open = true;
    c.el.classList.add("ochiq");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
    if (mx.sel == null) { mx.sel = i; return; }
    var a = mx.cards[mx.sel];
    mx.sel = null;
    if (a.k === c.k && a.f !== c.f) {
      a.done = c.done = true; mx.found++;
      if (mx.rek) { mx.rekJami++; }
      a.el.classList.add("topildi"); c.el.classList.add("topildi");
      $("mx-hint").textContent = x.mxOk(mxTx(c.k)[0], mxTx(c.k)[1]);
      $("mx-hint").classList.remove("bad");
      mxKayf(mx.found % 2 ? "yaxshi" : "zor");
      mxHead();
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
      if (mx.found >= mx.pairs) {
        mx.lock = true; clearInterval(mx.tm);
        setTimeout(function () { if (mx === me) { if (mx.rek) { mx.rekR++; mxRekTaxta(); mxGo(); } else { mxEnd(); } } }, 900);
      }
      return;
    }
    mx.mism++;
    if (mx.rek) {
      mx.lock = true; clearInterval(mx.tm);
      a.el.classList.add("xato"); c.el.classList.add("xato");
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
      setTimeout(function () { if (mx === me) { $("mx-stage").classList.add("hidden"); rekEnd("maxluq", mx.rekJami, $("mx-res")); } }, 900);
      return;
    }
    if (bl && mx.bell) { bl.xato++; }
    mx.lock = true;
    a.el.classList.add("xato"); c.el.classList.add("xato");
    $("mx-hint").textContent = a.f === c.f ? x.mxBir : x.mxBad;
    $("mx-hint").classList.add("bad");
    mxKayf("xafa");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    setTimeout(function () {
      if (mx !== me) { return; }
      a.open = c.open = false;
      a.el.classList.remove("ochiq", "xato"); c.el.classList.remove("ochiq", "xato");
      mx.lock = false;
    }, 850);
  }

  function mxEnd() {
    var x = drX(), me = mx, daraja = mx.n, box = $("mx-res");
    clearInterval(mx.tm);
    $("mx-stage").classList.add("hidden");
    if (mx.bell) { blFinish(box); return; }
    var otgan = Date.now() - mx.t0, kech = mx.lim && otgan > mx.lim ? (otgan > mx.lim * 2 ? 2 : 1) : 0;
    var erkin = mx.peek > 0 ? mx.pairs : mx.pairs * 2;       // shuncha xato juftlik bahoga ta'sir qilmaydi (izlash tabiiy)
    var s = Math.max(0, 100 - Math.max(0, mx.mism - erkin) * 10 - kech * 20);
    var baho = s >= 85 ? 5 : s >= 70 ? 4 : s >= 50 ? 3 : s >= 30 ? 2 : 1;
    var sc = { baho: baho, izoh: x.mxStat(mx.mism, kech) }, otdi = baho >= 3;
    var show = function (yangi) {
      if (mx !== me) { return; }
      if (otdi) { drResult(box, "«" + x.mxXgB[baho - 1] + "»", "maxluq", daraja, yangi); }
      if (otdi && yangi === true && daraja % 3 === 0 && daraja / 3 <= 11) {      // har uch darsda yangi maxluq (hpqoriq)
        var yk = QR_TARTIB[daraja / 3 - 1], qg = drEl("button", "dr-btn", x.qrGo), birinchi = box.querySelector(".dr-btn");
        qg.type = "button";
        qg.addEventListener("click", function () { mx = null; qrOpen(); });
        var yim = document.createElement("img");
        yim.className = "qr-yangi"; yim.alt = ""; yim.src = qrImg(yk, 0);
        box.insertBefore(yim, birinchi);
        box.insertBefore(drEl("b", "dr-res-p", x.qrNew(mxTx(yk)[0])), birinchi);
        box.insertBefore(qg, birinchi);
      }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.mxXgB[baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { mxOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { mx = null; fanOpen("maxluq"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = mxXgImg(baho >= 5 ? "zor" : baho === 4 ? "yaxshi" : baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.mxXgN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("maxluq", daraja, baho); drDone("maxluq", daraja, show); } else { show(null); }
  }

  /* ================= QO'RIQXONA: o'quvchining maxluqlari (server: hpqoriq.py, /api/qoriq) =================
     Maxluq darslardan keladi (har uch darsda bitta; ajdar bolasi - bellashuv uchligidan), yemish galleonga olinadi
     (1 galleon = 5 porsiya), kuniga bir marta boqiladi: 3 marta - o'smir, 10 marta - katta; katta maxluq har 7-boqishda
     1 galleon keltiradi. Boqilmasa jazo yo'q. Rasmlar: img/qoriq/<kod>-<0|1|2>.webp (bola / o'smir / katta). */
  var API_QORIQ = "https://bot.tizimshunos.uz/api/qoriq";
  var QR_TARTIB = ["gippo", "boyogli", "niffler", "flobber", "testral", "qurbaqa", "kalmar", "boutrakl", "salamandra", "mushuk", "kalamush", "ajdar"];   // bot: hpqoriq.MAXLUQLAR
  var qrData = null, qrBusy = false, qrLocal = null, qrAt = 0;
  /* Har maxluqning O'Z foydasi (egasi, 2026-10-08). Uchtasi sovg'a keltiradi (server: hpqoriq.SOVGALAR), qolgan to'qqiztasi
     KATTA bo'lgach mashq darslarida yordam beradi (bellashuvda EMAS - u yerda hamma teng): */
  var QR_FOYDA = {
    gippo:      ["Uchish darsida qo'shimcha jon", "Дополнительная жизнь на уроке полётов", "An extra life in Flying lessons"],
    boyogli:    ["Har 7-boqishda boshqa maxluqlarga 3 porsiya yemish keltiradi", "Каждое 7-е кормление приносит другим существам 3 порции корма", "Every 7th feeding it brings 3 portions of food for your other creatures"],
    niffler:    ["Har 7-boqishda 1 galleon topib keladi", "Каждое 7-е кормление находит 1 галлеон", "Every 7th feeding it finds 1 Galleon"],
    flobber:    ["Damlamalar darsida yana bitta xatoga ruxsat", "Ещё одна допустимая ошибка на уроке зельеварения", "One more mistake allowed in Potions lessons"],
    testral:    ["Qora kuchlardan himoya darsida qo'shimcha jon", "Дополнительная жизнь на уроке защиты", "An extra life in Defence lessons"],
    qurbaqa:    ["Maxluqlar darsida kartalar uzoqroq ochiq turadi", "Карты на уроке о существах дольше остаются открытыми", "Cards stay face-up longer in Creatures lessons"],
    kalmar:     ["Afsunlar darsida sham sekinroq yonadi", "Свеча на уроке заклинаний горит медленнее", "The candle burns slower in Charms lessons"],
    boutrakl:   ["Afsunlar darsida «Chiziqni ko'rsatish» bahoni pasaytirmaydi", "«Показать линию» на уроке заклинаний не снижает оценку", "“Show the line” no longer lowers your Charms grade"],
    salamandra: ["Damlamalar darsida sham sekinroq yonadi", "Свеча на уроке зельеварения горит медленнее", "The candle burns slower in Potions lessons"],
    mushuk:     ["Himoya darsida bitta noto'g'ri variant olib tashlanadi", "На уроке защиты убирается один неверный вариант", "One wrong option is removed in Defence lessons"],
    kalamush:   ["Sehrgarlik tarixi darsida bitta xato kechiriladi", "На уроке истории магии прощается одна ошибка", "One mistake is forgiven in History of Magic lessons"],
    ajdar:      ["Har 7-boqishda 2 galleon keltiradi", "Каждое 7-е кормление приносит 2 галлеона", "Every 7th feeding it brings 2 Galleons"]
  };
  function qrFoyda(k) { return (QR_FOYDA[k] || ["", "", ""])[lang === "ru" ? 1 : lang === "en" ? 2 : 0]; }
  function qrKatta(k) {
    var q = qrData && qrData.list && qrData.list.filter(function (m) { return m.kod === k; })[0];
    return !!(q && q.got && q.stage === 2);
  }
  // Darsda yordam berayotgan maxluqlar: bellashuvda yo'q. Ro'yxatdagi kattalari qaytadi va bitta xabar chiqadi.
  function qrYordam(kodlar, bell) {
    if (bell) { return {}; }
    var bor = {}, nomlar = [];
    kodlar.forEach(function (k) { if (qrKatta(k)) { bor[k] = true; nomlar.push(mxTx(k)[0] + ": " + qrFoyda(k).toLowerCase()); } });
    if (nomlar.length) { showToast(nomlar.join(" · ")); }
    return bor;
  }
  // Qo'riqxona holati darslar uchun (5 daqiqada bir marta, Darslar ochilganda)
  function qrLoad() {
    if (Date.now() - qrAt < 300000) { return; }
    qrAt = Date.now();
    qrPost({}, function (res) { if (res && res.list) { qrData = res; } });
  }
  function qrImg(k, st) { return IMG_DIR + "qoriq/" + k + "-" + (st || 0) + ".webp"; }
  function qrSample(body) {
    if (!qrLocal) {
      qrLocal = { gal: 4, m: {} };
      QR_TARTIB.forEach(function (k, i) { if (i < 5) { qrLocal.m[k] = { fed: [0, 4, 11, 2, 9][i], food: [0, 3, 6, 0, 2][i], today: i === 1 }; } });
    }
    var L = qrLocal, res = { ok: true }, k = body && (body.buy || body.feed), o = k && L.m[k];
    if (body && body.buy) { if (L.gal < 1) { res.ok = false; res.error = "pul"; } else { L.gal--; o.food += 5; } }
    if (body && body.feed) {
      if (o.today) { res.ok = false; res.error = "bugun"; } else if (o.food < 1) { res.ok = false; res.error = "yemish"; }
      else {
        var oldin = o.fed >= 10 ? 2 : o.fed >= 3 ? 1 : 0;
        o.fed++; o.food--; o.today = true;
        var endi = o.fed >= 10 ? 2 : o.fed >= 3 ? 1 : 0;
        res.fed = k; res.grew = endi !== oldin ? endi : null; res.gift = (k === "niffler" || k === "ajdar") && o.fed > 10 && (o.fed - 10) % 7 === 0 ? { type: "gal", n: k === "ajdar" ? 2 : 1 } : 0;
        L.gal += res.gift ? res.gift.n : 0;
      }
    }
    res.gal = L.gal;
    res.hosil = 2;
    res.prices = { gal: 1, n: 5, teen: 3, adult: 10, gift_every: 7, gift: 1 };
    res.list = QR_TARTIB.map(function (kod, i) {
      var q = L.m[kod], b = q ? q.fed : 0, st = b >= 10 ? 2 : b >= 3 ? 1 : 0;
      return { kod: kod, got: !!q, need: kod === "ajdar" ? 0 : (i + 1) * 3, fed: b, stage: st, next: st === 0 ? 3 - b : st === 1 ? 10 - b : 0,
               food: q ? q.food : 0, today: !!(q && q.today), gift: st === 2 && (kod === "niffler" || kod === "ajdar" || kod === "boyogli") ? 7 - (b - 10) % 7 : 0 };
    });
    return res;
  }
  function qrPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_QORIQ, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.list ? res : (MS_LOCAL ? qrSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? qrSample(body) : null); });
  }
  function qrOpen() {
    var x = drX();
    drShowGame("scr-qoriq");
    $("qr-kick").textContent = drFan("maxluq").ust[lang];
    $("qr-ttl").textContent = x.qrT;
    $("qr-tip").textContent = x.qrTip;
    $("qr-xg").src = mxXgImg("maslahat");
    qrRender();
    qrPost({}, function (res) { if (res && res.list) { qrData = res; qrRender(); } else if (!qrData) { showToast(x.fail, "err"); } });
  }
  function qrDe(matn, kayf) { $("qr-tip").textContent = matn; $("qr-xg").src = mxXgImg(kayf || "zor"); }
  function qrAct(body, kod) {
    if (qrBusy) { return; }
    var x = drX(), nom = mxTx(kod)[0];
    qrBusy = true;
    qrPost(body, function (res) {
      qrBusy = false;
      if (!res || !res.list) { showToast(x.fail, "err"); return; }
      qrData = res;
      qrRender();
      if (res.error === "pul") { showToast(x.qrPoor, "err"); qrDe(x.qrPoor, "xafa"); return; }
      if (res.error) { return; }
      if (body.feed) {
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        var sv = res.gift && res.gift.n ? (res.gift.type === "food" ? x.qrGotF(nom, res.gift.n) : x.qrGot(nom, res.gift.n)) : "";
        qrDe(sv || (res.grew != null ? x.qrGrew(nom, x.qrSt[res.grew]) : x.qrYum(nom)), sv || res.grew != null ? "zor" : "yaxshi");
        if (sv || res.grew != null) { showToast(sv || x.qrGrew(nom, x.qrSt[res.grew])); }
        var el = document.querySelector('.qr-c[data-k="' + kod + '"]');
        if (el) { el.classList.add(res.grew != null ? "osdi" : "yedi"); }
      }
    });
  }
  function qrRender() {
    var x = drX(), box = $("qr-list"), d = qrData;
    box.innerHTML = "";
    if (!d) { $("qr-sum").textContent = ""; $("qr-gal").textContent = ""; return; }
    var bor = d.list.filter(function (q) { return q.got; }).length, P = d.prices || { gal: 1, n: 5 };
    $("qr-sum").textContent = x.qrSum(bor, d.list.length);
    $("qr-gal").textContent = x.qrGal(d.gal) + (d.hosil ? " · " + isX().hosil(d.hosil).toLowerCase() : "");
    d.list.forEach(function (q) {
      var t = mxTx(q.kod), c = drEl("div", "qr-c" + (q.got ? "" : " yopiq") + (q.stage === 2 ? " katta" : ""));
      c.setAttribute("data-k", q.kod);
      var im = document.createElement("img");
      im.className = "qr-im"; im.alt = ""; im.src = qrImg(q.kod, q.got ? q.stage : 2);
      c.appendChild(im);
      var tx = drEl("div", "qr-tx");
      tx.appendChild(drEl("b", "", q.got ? t[0] : "???"));
      if (!q.got) {
        tx.appendChild(drEl("small", "qr-lock", q.need ? x.qrLock(q.need) : x.qrRare));
        c.appendChild(tx); box.appendChild(c);
        return;
      }
      tx.appendChild(drEl("span", "qr-st", x.qrSt[q.stage]));
      var jami = q.stage === 0 ? 3 : 7, qilingan = q.stage === 0 ? q.fed : q.stage === 1 ? q.fed - 3 : q.gift ? 7 - q.gift : 7;
      var bar = drEl("span", "qr-bar"), bi = drEl("i");
      bi.style.width = Math.round(100 * Math.max(0, qilingan) / jami) + "%";
      bar.appendChild(bi);
      tx.appendChild(bar);
      tx.appendChild(drEl("small", "", q.stage === 2 ? (q.gift ? x.qrGift(q.gift) : "") : x.qrNext(q.next, x.qrSt[q.stage + 1])));
      tx.appendChild(drEl("small", "qr-fy" + (q.stage === 2 ? " on" : ""), (q.stage === 2 ? x.qrFy : x.qrFyK) + ": " + qrFoyda(q.kod).toLowerCase()));
      var fd = drEl("span", "qr-fd"), fi = document.createElement("img");
      fi.alt = ""; fi.src = mxImg(q.kod, true);
      fd.appendChild(fi);
      fd.appendChild(drEl("small", "", x.qrFood(t[1], q.food)));
      tx.appendChild(fd);
      var bt = drEl("div", "qr-bt");
      if (q.today) { bt.appendChild(drEl("span", "qr-fed", x.qrFed)); }
      else if (q.food > 0) {
        var fb = drEl("button", "qr-b asosiy", x.qrFeed);
        fb.type = "button";
        fb.addEventListener("click", function () { qrAct({ feed: q.kod }, q.kod); });
        bt.appendChild(fb);
      }
      if (!q.today && q.food < 1 && d.hosil > 0) {       // Issiqxona hosili: 1 hosil = 1 boqish
        var hb = drEl("button", "qr-b asosiy", isX().qrHosil(d.hosil));
        hb.type = "button";
        hb.addEventListener("click", function () { qrAct({ feed: q.kod, hosil: 1 }, q.kod); });
        bt.appendChild(hb);
      }
      if (q.food < 1) {
        var bb = drEl("button", "qr-b", x.qrBuy(P.gal, P.n));
        bb.type = "button";
        bb.addEventListener("click", function () {
          if (qrData.gal < P.gal) { showToast(x.qrPoor, "err"); qrDe(x.qrPoor, "xafa"); return; }
          testAsk(x.qrAsk(t[1], P.gal, P.n, qrData.gal), function () { qrAct({ buy: q.kod }, q.kod); });
        });
        bt.appendChild(bb);
      }
      tx.appendChild(bt);
      c.appendChild(tx);
      box.appendChild(c);
    });
  }

  /* ================= ASTRONOMIYA: burilgan turkumni tanish (FAZOVIY TASAVVUR) =================
     Egasi (2026-10-08): avvalgi «yulduzlar tartibini eslab ulash» xotira mashqi edi va Damlamalar/Maxluqlarga o'xshab
     qolgan - mexanizm ALMASHTIRILDI. Endi: tepada turkum NAMUNASI, pastda bir nechta shakl - bittasi aynan o'sha
     turkum, lekin BURILGAN; qolganlari chalg'ituvchi (boshqa turkum, ko'zgudagi aksi, bitta yulduzi siljigan nusxa).
     Eslab qolish kerak emas - shaklni xayolan aylantirish kerak. 12 turkum (shakllari soddalashtirilgan).
     Darslar (bot: ASTRO_DARS = 36): 1-12 - 4 variant, chalg'ituvchilar boshqa turkumlar, burilish 90 gradusga karrali;
     13-24 - ixtiyoriy burilish, chalg'ituvchilar orasida ko'zgudagi aksi; 25-36 - 6 variant, aksi va bitta yulduzi
     siljigan nusxa. Har savolga bitta urinish, sham = vaqt. Baho: to'g'ri javoblar ulushi (90 / 78 / 60).
     Bellashuv: 8 savol, hammaga bir xil (mavzu a1..a12 dan urug'), xato +3 s. */
  var YL = {
    ayiq:       { p: [[0.1, 0.3], [0.26, 0.26], [0.4, 0.32], [0.52, 0.42], [0.56, 0.62], [0.8, 0.66], [0.8, 0.44]],
                  uz: ["Katta Ayiq", "Yetti yulduzli «cho'mich» — osmondagi eng taniqli shakl."], ru: ["Большая Медведица", "«Ковш» из семи звёзд — самая узнаваемая фигура неба."], en: ["Great Bear", "The seven-star Plough — the best-known shape in the sky."] },
    kassiopeya: { p: [[0.12, 0.35], [0.3, 0.65], [0.5, 0.42], [0.7, 0.68], [0.88, 0.38]],
                  uz: ["Kassiopeya", "Osmondagi «W» harfi."], ru: ["Кассиопея", "Буква «W» на небе."], en: ["Cassiopeia", "The letter W in the sky."] },
    orion:      { p: [[0.3, 0.15], [0.68, 0.2], [0.58, 0.5], [0.5, 0.5], [0.42, 0.5], [0.3, 0.82], [0.72, 0.85]],
                  uz: ["Orion", "Ovchi turkumi. Bellatrisa — uning yelkasidagi yulduz."], ru: ["Орион", "Созвездие охотника. Беллатриса — звезда на его плече."], en: ["Orion", "The Hunter. Bellatrix is the star on his shoulder."] },
    it:         { p: [[0.5, 0.12], [0.42, 0.36], [0.3, 0.5], [0.48, 0.62], [0.62, 0.84], [0.36, 0.86]],
                  uz: ["Katta It", "Sirius — osmondagi eng yorqin yulduz — shu turkumda."], ru: ["Большой Пёс", "Сириус, самая яркая звезда неба, находится здесь."], en: ["Great Dog", "Sirius, the brightest star in the sky, lives here."] },
    arslon:     { p: [[0.72, 0.3], [0.62, 0.16], [0.48, 0.2], [0.44, 0.38], [0.5, 0.56], [0.2, 0.6], [0.12, 0.42]],
                  uz: ["Arslon", "Regulus — Arslonning yuragi."], ru: ["Лев", "Регул — сердце Льва."], en: ["Leo", "Regulus is the heart of the Lion."] },
    chayon:     { p: [[0.8, 0.15], [0.72, 0.3], [0.62, 0.42], [0.52, 0.58], [0.42, 0.74], [0.28, 0.82], [0.16, 0.74], [0.2, 0.6]],
                  uz: ["Chayon", "Lotincha nomi — Skorpius."], ru: ["Скорпион", "По-латыни — Скорпиус."], en: ["Scorpius", "The Scorpion — Scorpius in Latin."] },
    ajdar:      { p: [[0.82, 0.2], [0.7, 0.3], [0.76, 0.46], [0.6, 0.56], [0.44, 0.46], [0.3, 0.56], [0.34, 0.74], [0.16, 0.84]],
                  uz: ["Ajdar", "Lotincha nomi — Drako."], ru: ["Дракон", "По-латыни — Драко."], en: ["Draco", "The Dragon — Draco in Latin."] },
    andromeda:  { p: [[0.12, 0.72], [0.3, 0.6], [0.5, 0.52], [0.66, 0.34], [0.88, 0.3]],
                  uz: ["Andromeda", "Bleklar oilasida shu nomli sehrgar ayol bor."], ru: ["Андромеда", "В семье Блэков есть волшебница с этим именем."], en: ["Andromeda", "A witch of the Black family bears this name."] },
    toj:        { p: [[0.14, 0.4], [0.24, 0.6], [0.42, 0.72], [0.6, 0.7], [0.76, 0.58], [0.86, 0.38]],
                  uz: ["Shimoliy toj", "Yulduzlardan yasalgan yarim doira toj."], ru: ["Северная Корона", "Полукруглая корона из звёзд."], en: ["Northern Crown", "A half-circle crown of stars."] },
    lira:       { p: [[0.5, 0.12], [0.4, 0.36], [0.3, 0.74], [0.56, 0.8], [0.64, 0.42]],
                  uz: ["Lira", "Eng yorqin yulduzi — Vega."], ru: ["Лира", "Её самая яркая звезда — Вега."], en: ["Lyra", "Its brightest star is Vega."] },
    bori:       { p: [[0.2, 0.2], [0.4, 0.3], [0.36, 0.52], [0.56, 0.6], [0.66, 0.42], [0.82, 0.74]],
                  uz: ["Bo'ri", "Lotincha nomi — Lupus."], ru: ["Волк", "По-латыни — Люпус."], en: ["Lupus", "The Wolf — Lupus in Latin."] },
    feniks:     { p: [[0.14, 0.5], [0.36, 0.34], [0.56, 0.44], [0.5, 0.68], [0.74, 0.62], [0.88, 0.3]],
                  uz: ["Feniks", "Kuldan qayta tug'iladigan qush turkumi."], ru: ["Феникс", "Созвездие птицы, возрождающейся из пепла."], en: ["Phoenix", "The bird that rises from its ashes."] }
  };
  var YL_TARTIB = ["ayiq", "kassiopeya", "orion", "it", "arslon", "chayon", "ajdar", "andromeda", "toj", "lira", "bori", "feniks"];
  var YL_SIM = { kassiopeya: 1, toj: 1, andromeda: 1 };      // o'zi simmetrik - ko'zgudagi aksi chalg'ituvchi bo'la olmaydi
  var yl = null;      // {n, bell, savol:[{id, opts:[{p, rot, ok}]}], i, ok, t0, lim, tm, lock}
  function ylTx(id) { return YL[id][lang] || YL[id].uz; }
  function ylSnImg(k) { return IMG_DIR + "sinistra/" + k + ".webp"; }
  function ylKayf(k) { ["yl-sn-im", "yl-sn-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = ylSnImg(k); } }); }
  function ylStop() { if (yl) { clearInterval(yl.tm); yl.tm = 0; } }
  // Shakl (nuqtalar) -> SVG: markazlab, o'lchamga sig'dirib, kerak bo'lsa aks ettirib va burib chizadi
  function ylFig(P, rot, aks) {
    var cx = 0, cy = 0, R = 0, i, a = rot * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), q = [], d = "", h = "";
    for (i = 0; i < P.length; i++) { cx += P[i][0]; cy += P[i][1]; }
    cx /= P.length; cy /= P.length;
    for (i = 0; i < P.length; i++) { R = Math.max(R, Math.hypot(P[i][0] - cx, P[i][1] - cy)); }
    for (i = 0; i < P.length; i++) {
      var x = (P[i][0] - cx) / R * (aks ? -1 : 1), y = (P[i][1] - cy) / R;
      q.push([50 + (x * ca - y * sa) * 38, 50 + (x * sa + y * ca) * 38]);
    }
    for (i = 0; i < q.length; i++) { d += (i ? "L" : "M") + q[i][0].toFixed(1) + " " + q[i][1].toFixed(1); h += '<circle cx="' + q[i][0].toFixed(1) + '" cy="' + q[i][1].toFixed(1) + '" r="3.4"/>'; }
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="' + d + '"/>' + h + "</svg>";
  }
  // Bitta yulduzi siljigan nusxa
  function ylSiljit(P, r1, r2) {
    var k = 1 + Math.floor(r1 * (P.length - 2)), a = r2 * Math.PI * 2;
    return P.map(function (p, j) { return j === k ? [p[0] + Math.cos(a) * 0.2, p[1] + Math.sin(a) * 0.2] : p; });
  }
  function ylPlan(n, urug, rek) {
    var bell = urug != null, T = YL_TARTIB, L = T.length, s0 = rek ? Math.floor(Math.random() * 90000) : bell ? urug : n * 61, soni = rek ? 150 : bell ? 8 : 5 + Math.min(3, Math.floor((n - 1) / 9));
    var bosq = bell ? 1 : n <= 12 ? 0 : n <= 24 ? 1 : 2, var_ = bosq === 2 ? 6 : 4, savol = [], i, g;
    var rnd = function (k) { return afRnd(s0 + k * 7.31); };
    for (i = 0; i < soni; i++) {
      if (rek) { bosq = i < 5 ? 0 : i < 15 ? 1 : 2; var_ = bosq === 2 ? 6 : 4; }
      var id = (!bell && !rek && n <= L && i === 0) ? T[n - 1] : T[Math.floor(rnd(i * 13 + 1) * L)], P = YL[id].p;
      if (i && savol[i - 1].id === id) { id = T[(T.indexOf(id) + 3) % L]; P = YL[id].p; }
      var bur = bosq === 0 ? [90, 180, 270][Math.floor(rnd(i * 13 + 2) * 3)] : 40 + Math.floor(rnd(i * 13 + 2) * 280);
      var opts = [{ p: P, rot: bur, aks: false, ok: true }];
      if (bosq >= 1 && !YL_SIM[id]) { opts.push({ p: P, rot: Math.floor(rnd(i * 13 + 3) * 360), aks: true }); }
      if (bosq === 2) { opts.push({ p: ylSiljit(P, rnd(i * 13 + 4), rnd(i * 13 + 5)), rot: Math.floor(rnd(i * 13 + 6) * 360), aks: false }); }
      g = 0;
      var band = [id];
      while (opts.length < var_ && g < 60) {
        var boshqa = T[Math.floor(rnd(i * 13 + 20 + g) * L)];
        g++;
        if (band.indexOf(boshqa) < 0) { band.push(boshqa); opts.push({ p: YL[boshqa].p, rot: Math.floor(rnd(i * 13 + 40 + g) * 360), aks: rnd(i * 13 + 50 + g) < 0.5 }); }
      }
      for (g = opts.length - 1; g > 0; g--) { var j = Math.floor(rnd(i * 13 + 70 + g) * (g + 1)), t = opts[g]; opts[g] = opts[j]; opts[j] = t; }
      savol.push({ id: id, opts: opts });
    }
    return { savol: savol, lim: bell ? 0 : Math.round(Math.max(5000, 10000 - n * 130)) };
  }

  function ylOpen(bell, n) {
    var st = drData && drData.astro, x = drX(), f = drFan("astro"), urug = null, i;
    if (bell === true) { var it = String((st && st.contest && st.contest.item) || "a1"); urug = 0; for (i = 0; i < it.length; i++) { urug += it.charCodeAt(i) * (i + 3); } }
    var plan = ylPlan(n || 1, urug, bell === "rek");
    ylStop();
    yl = { n: n || 1, bell: bell === true, rek: bell === "rek", savol: plan.savol, lim: plan.lim, i: 0, ok: 0, t0: 0, tm: 0, lock: false };
    drShowGame("scr-astro");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var im = new Image(); im.src = ylSnImg(k); });
    $("yl-kick").textContent = f.nom[lang];
    $("yl-ttl").textContent = f.ust[lang];
    $("yl-today").textContent = yl.rek ? x.rekT : yl.bell ? x.bell : x.lvl(yl.n);
    $("yl-name").textContent = f.nom[lang];
    $("yl-desc").textContent = "";
    $("yl-res").classList.add("hidden");
    $("yl-stage").classList.add("hidden");
    $("yl-intro").classList.toggle("hidden", yl.bell || yl.rek);
    if (yl.bell || yl.rek) { ylGo(); return; }
    $("yl-intro-t").textContent = x.ylI[yl.n <= 12 ? 0 : yl.n <= 24 ? 1 : 2];
    $("yl-go").textContent = x.ylGo;
    ylKayf("maslahat");
  }
  function ylGo() {
    $("yl-intro").classList.add("hidden");
    $("yl-stage").classList.remove("hidden");
    $("yl-sham").classList.toggle("hidden", yl.bell);
    yl.i = 0;
    ylStep();
  }
  function ylHead() {
    var x = drX();
    $("yl-step").textContent = (yl.rek ? x.rekT + " · " + yl.ok : x.ylStep(Math.min(yl.i + 1, yl.savol.length), yl.savol.length)) + (bl && yl.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
  }
  // Navbatdagi savol: namuna va variantlar
  function ylStep() {
    var x = drX(), me = yl, q = yl.savol[yl.i], box = $("yl-opts");
    yl.lock = false;
    if (yl.rek) { yl.lim = Math.max(3500, 9000 - yl.i * 250); }
    $("yl-name").textContent = ylTx(q.id)[0];
    $("yl-desc").textContent = "";
    $("yl-ref").innerHTML = "<small>" + x.ylNam + "</small>" + ylFig(YL[q.id].p, 0, false);
    $("yl-hint").textContent = x.ylHint;
    $("yl-hint").classList.remove("bad");
    ylKayf("maslahat");
    box.className = "yl-opts" + (q.opts.length > 4 ? " olti" : "");
    box.innerHTML = "";
    q.opts.forEach(function (o, k) {
      var b = drEl("button", "yl-o");
      b.type = "button";
      b.innerHTML = ylFig(o.p, o.rot, o.aks);
      b.addEventListener("click", function () { ylPick(k, b); });
      box.appendChild(b);
    });
    $("yl-sham-w").style.width = "100%";
    $("yl-sham").classList.remove("ochdi", "oz");
    ylHead();
    yl.t0 = Date.now();
    clearInterval(yl.tm);
    yl.tm = setInterval(function () {
      if (yl !== me || $("scr-astro").classList.contains("hidden")) { clearInterval(me.tm); return; }
      if (yl.bell) { ylHead(); return; }
      if (yl.lock) { return; }
      var p = Math.max(0, 1 - (Date.now() - yl.t0) / yl.lim);
      $("yl-sham-w").style.width = (p * 100).toFixed(1) + "%";
      $("yl-sham").classList.toggle("oz", p > 0 && p < 0.3);
      $("yl-sham").classList.toggle("ochdi", p <= 0);
      if (p <= 0) { ylPick(-1, null); }
    }, 100);
  }
  function ylPick(k, btn) {
    if (!yl || yl.lock) { return; }
    var x = drX(), me = yl, q = yl.savol[yl.i], togri = k >= 0 && !!q.opts[k].ok;
    yl.lock = true;
    [].slice.call($("yl-opts").children).forEach(function (b, j) { if (q.opts[j].ok) { b.classList.add("togri"); } });
    if (togri) {
      yl.ok++;
      $("yl-hint").textContent = x.ylOk[yl.i % x.ylOk.length] + " " + ylTx(q.id)[1];
      $("yl-hint").classList.remove("bad");
      ylKayf((Date.now() - yl.t0) < (yl.lim || 6000) * 0.5 ? "zor" : "yaxshi");
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    } else {
      if (btn) { btn.classList.add("xato"); }
      if (bl && yl.bell) { bl.xato++; }
      $("yl-hint").textContent = k < 0 ? x.ylLate : x.ylBad;
      $("yl-hint").classList.add("bad");
      ylKayf("xafa");
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    }
    setTimeout(function () {
      if (yl !== me) { return; }
      if (yl.rek && !togri) { ylStop(); $("yl-stage").classList.add("hidden"); rekEnd("astro", yl.ok, $("yl-res")); return; }
      yl.i++;
      if (yl.i >= yl.savol.length) { ylEnd(); return; }
      ylStep();
    }, yl.bell ? 500 : togri ? 1500 : 1300);
  }
  function ylEnd() {
    var x = drX(), me = yl, daraja = yl.n, box = $("yl-res"), jami = yl.savol.length;
    ylStop();
    $("yl-stage").classList.add("hidden");
    $("yl-name").textContent = drFan("astro").nom[lang];
    $("yl-desc").textContent = "";
    if (yl.rek) { rekEnd("astro", yl.ok, box); return; }
    if (yl.bell) { blFinish(box); return; }
    var s = Math.round(100 * yl.ok / jami), baho = s >= 90 ? 5 : s >= 78 ? 4 : s >= 60 ? 3 : s >= 40 ? 2 : 1;
    var sc = { baho: baho, izoh: x.ylStat(yl.ok, jami) }, otdi = baho >= 3;
    var show = function (yangi) {
      if (yl !== me) { return; }
      if (otdi) { drResult(box, "«" + x.ylB[baho - 1] + "»", "astro", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.ylB[baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { ylOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { yl = null; fanOpen("astro"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = ylSnImg(baho >= 5 ? "zor" : baho === 4 ? "yaxshi" : baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.ylSnN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("astro", daraja, baho); drDone("astro", daraja, show); } else { show(null); }
  }

  /* ================= O'SIMLIKSHUNOSLIK: issiqxonada bir nechta o'simlikka o'z vaqtida parvarish =================
     Bu DIQQATNI TAQSIMLASH mashqi (egasi, 2026-10-08: fanlar bir-biriga o'xshamasin, har biri boshqa qobiliyatni mashq
     qildirsin - bu yerda xotira EMAS). Tuvaklardagi o'simliklar ustida ehtiyoj belgisi chiqadi (suv, nur, qaychi, o'g'it)
     va chizig'i kamayib boradi; pastdan shu asbob tanlanib, o'simlik bosiladi. Ulgurilmasa o'simlik so'liydi - jon ketadi.
     Darslar (bot: OSIMLIK_DARS = 36): 1-4 - 4 tuvak, 2 asbob; 5-12 - 3 asbob (9-darsdan 6 tuvak); 13-36 - 4 asbob;
     ehtiyojlar soni 10 -> 24, ular tezroq chiqadi va qisqaroq kutadi. Bellashuv: 18 ehtiyoj, kutish cheksiz (jon yo'q),
     tartibi hammaga bir xil; xato asbob +3 s. */
  var OS_AS = ["suv", "nur", "qaychi", "ogit"];
  var OS_GUL = ["mandragora", "tentakula", "geran", "bubotuber", "mimbulus", "puffapod"];
  var os = null;      // {n, bell, pots:[{need, t0, life, el}], navbat:[{p, a}], ni, tool, served, wilt, wrong, lives, jami, tm}
  function osImg(k) { return IMG_DIR + "osimlik/" + k + ".webp"; }
  function osSpImg(k) { return IMG_DIR + "sprout/" + k + ".webp"; }
  function osKayf(k) { ["os-sp-im", "os-sp-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = osSpImg(k); } }); }
  function osStop() { if (os) { clearInterval(os.tm); os.tm = 0; } }
  function osPlan(n, urug, rek) {
    var bell = urug != null, s0 = rek ? Math.floor(Math.random() * 90000) : bell ? urug : n * 43, tuvak = rek || bell || n >= 9 ? 6 : 4, asbob = rek || bell || n >= 13 ? 4 : n >= 5 ? 3 : 2;
    var jami = rek ? 500 : bell ? 18 : 10 + Math.floor((n - 1) * 0.4), navbat = [], oldingi = -1, g = 0;
    while (navbat.length < jami && g < 4000) {
      var p = Math.floor(afRnd(s0 + g * 2) * tuvak), a = Math.floor(afRnd(s0 + g * 2 + 1) * asbob);
      g++;
      if (p !== oldingi) { navbat.push({ p: p, a: a }); oldingi = p; }
    }
    return { tuvak: tuvak, asbob: asbob, jami: jami, navbat: navbat,
             oraliq: bell ? 650 : Math.round(Math.max(900, 2300 - n * 40)), kut: bell ? 0 : Math.round(Math.max(2800, 5600 - n * 80)) };
  }

  function osOpen(bell, n) {
    var st = drData && drData.osimlik, x = drX(), f = drFan("osimlik"), urug = null, i;
    if (bell === true) { var it = String((st && st.contest && st.contest.item) || "o1"); urug = 0; for (i = 0; i < it.length; i++) { urug += it.charCodeAt(i) * (i + 13); } }
    var plan = osPlan(n || 1, urug, bell === "rek");
    osStop();
    if (bell === "rek") { plan.oraliq = 2000; plan.kut = 5000; }
    os = { n: n || 1, bell: bell === true, rek: bell === "rek", plan: plan, pots: [], ni: 0, tool: 0, served: 0, wilt: 0, wrong: 0, lives: 3, jami: plan.jami, keyingi: 0, tm: 0, tugadi: false };
    if (os.rek) { os.lives = 1; }
    drShowGame("scr-osimlik");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var im = new Image(); im.src = osSpImg(k); });
    OS_AS.concat(OS_GUL).forEach(function (k) { var im = new Image(); im.src = osImg(k); });
    $("os-kick").textContent = f.nom[lang];
    $("os-ttl").textContent = f.ust[lang];
    $("os-today").textContent = os.rek ? x.rekT : os.bell ? x.bell : x.lvl(os.n);
    $("os-res").classList.add("hidden");
    $("os-stage").classList.add("hidden");
    $("os-intro").classList.toggle("hidden", os.bell || os.rek);
    if (os.bell || os.rek) { osGo(); return; }
    $("os-intro-t").textContent = x.osI[os.n === 1 ? 0 : (os.n === 5 || os.n === 13) ? 1 : os.n === 9 ? 2 : 0];
    $("os-go").textContent = x.osGo;
    osKayf("maslahat");
  }

  function osGo() {
    var x = drX(), me = os, P = os.plan, grid = $("os-grid"), bar = $("os-tools"), i;
    $("os-intro").classList.add("hidden");
    $("os-stage").classList.remove("hidden");
    $("os-lives").classList.toggle("hidden", os.bell || os.rek);
    grid.innerHTML = ""; bar.innerHTML = "";
    grid.className = "os-grid" + (P.tuvak > 4 ? " olti" : "");
    os.pots = [];
    for (i = 0; i < P.tuvak; i++) {
      (function (k) {
        var b = drEl("button", "os-p"), im = document.createElement("img"), eh = drEl("span", "os-eh hidden"), ei = document.createElement("img"), ch = drEl("i", "os-ch");
        b.type = "button";
        im.className = "os-gul"; im.alt = ""; im.src = osImg(OS_GUL[k % OS_GUL.length]);
        ei.alt = "";
        eh.appendChild(ei); eh.appendChild(ch);
        b.appendChild(im); b.appendChild(eh);
        b.addEventListener("click", function () { osPot(k); });
        grid.appendChild(b);
        os.pots.push({ need: -1, t0: 0, el: b, eh: eh, ei: ei, ch: ch });
      })(i);
    }
    for (i = 0; i < P.asbob; i++) {
      (function (k) {
        var t = drEl("button", "os-t" + (k === 0 ? " on" : "")), im = document.createElement("img");
        t.type = "button";
        im.alt = ""; im.src = osImg(OS_AS[k]);
        t.appendChild(im);
        t.appendChild(drEl("small", "", x.osAs[k]));
        t.addEventListener("click", function () { if (!os) { return; } os.tool = k; [].slice.call(bar.children).forEach(function (q, j) { q.classList.toggle("on", j === k); }); try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {} });
        bar.appendChild(t);
      })(i);
    }
    os.tool = 0;
    os.keyingi = Date.now() + 700;
    $("os-hint").textContent = x.osHint;
    $("os-hint").classList.remove("bad");
    osKayf("maslahat");
    osHud();
    clearInterval(os.tm);
    os.tm = setInterval(function () {
      if (os !== me || $("scr-osimlik").classList.contains("hidden")) { clearInterval(me.tm); return; }
      osTick();
    }, 100);
  }
  function osHud() {
    var x = drX(), el = $("os-lives");
    el.innerHTML = "";
    for (var i = 0; i < 3; i++) { el.appendChild(drEl("i", i < os.lives ? "on" : "")); }
    $("os-step").textContent = (os.rek ? x.rekT + " · " + os.served : x.osStep(os.served + os.wilt, os.jami)) + (bl && os.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
  }
  function osTick() {
    var x = drX(), me = os, P = os.plan, now = Date.now(), ochiq = 0;
    // yangi ehtiyoj: navbatdagi tuvak bo'sh bo'lsa
    if (os.ni < P.navbat.length && now >= os.keyingi) {
      var q = P.navbat[os.ni], pot = os.pots[q.p];
      if (pot.need < 0 && !pot.sol) {
        pot.need = q.a; pot.t0 = now;
        pot.ei.src = osImg(OS_AS[q.a]);
        pot.eh.classList.remove("hidden");
        pot.el.classList.add("kerak");
        os.ni++;
        os.keyingi = now + P.oraliq;
      }
    }
    os.pots.forEach(function (p) {
      if (p.need < 0) { return; }
      ochiq++;
      if (!P.kut) { return; }
      var qoldi = 1 - (now - p.t0) / P.kut;
      p.ch.style.width = Math.max(0, qoldi * 100).toFixed(1) + "%";
      p.ch.classList.toggle("oz", qoldi < 0.35);
      if (qoldi <= 0) {       // ulgurilmadi - so'lidi
        p.need = -1; p.sol = true;
        p.eh.classList.add("hidden");
        p.el.classList.remove("kerak"); p.el.classList.add("soldi");
        os.wilt++; os.lives--;
        $("os-hint").textContent = x.osWilt; $("os-hint").classList.add("bad");
        osKayf("xafa");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
        setTimeout(function () { if (os === me) { p.sol = false; p.el.classList.remove("soldi"); } }, 1400);
        osHud();
      }
    });
    if (os.bell) { osHud(); }
    if (!os.tugadi && ((os.served + os.wilt >= os.jami) || (!os.bell && os.lives <= 0))) {
      os.tugadi = true;
      clearInterval(os.tm);
      setTimeout(function () { if (os === me) { osEnd(); } }, 700);
    }
  }
  function osPot(k) {
    if (!os || os.tugadi) { return; }
    var x = drX(), p = os.pots[k];
    if (p.need < 0) { return; }
    if (p.need !== os.tool) {
      os.wrong++;
      if (os.rek) { os.lives = 0; }
      if (bl && os.bell) { bl.xato++; }
      p.el.classList.remove("xato"); void p.el.offsetWidth; p.el.classList.add("xato");
      $("os-hint").textContent = x.osBad; $("os-hint").classList.add("bad");
      osKayf("xafa");
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
      return;
    }
    p.need = -1;
    p.eh.classList.add("hidden");
    p.el.classList.remove("kerak", "xato");
    p.el.classList.remove("yaxshi"); void p.el.offsetWidth; p.el.classList.add("yaxshi");
    os.served++;
    if (os.rek) { os.plan.oraliq = Math.max(600, 2000 - os.served * 45); os.plan.kut = Math.max(2200, 5000 - os.served * 70); }
    $("os-hint").textContent = x.osOk[os.served % x.osOk.length]; $("os-hint").classList.remove("bad");
    osKayf(os.served % 3 === 0 ? "zor" : "yaxshi");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    osHud();
  }
  function osEnd() {
    var x = drX(), me = os, daraja = os.n, box = $("os-res");
    osStop();
    $("os-stage").classList.add("hidden");
    if (os.rek) { rekEnd("osimlik", os.served, box); return; }
    if (os.bell) { blFinish(box); return; }
    var s = Math.round(100 * os.served / os.jami) - os.wrong * 5, baho = s >= 90 ? 5 : s >= 78 ? 4 : s >= 60 ? 3 : s >= 40 ? 2 : 1;
    if (os.lives <= 0) { baho = Math.min(baho, 2); }
    var sc = { baho: baho, izoh: x.osStat(os.served, os.jami, os.wrong) }, otdi = baho >= 3;
    var show = function (yangi) {
      if (os !== me) { return; }
      if (otdi) { drResult(box, "«" + x.osB[baho - 1] + "»", "osimlik", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.osB[baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { osOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { os = null; fanOpen("osimlik"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = osSpImg(baho >= 5 ? "zor" : baho === 4 ? "yaxshi" : baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.osSpN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("osimlik", daraja, baho); drDone("osimlik", daraja, show); } else { show(null); }
  }

  /* ================= TRANSFIGURATSIYA: afsun qoidasini topish (MANTIQ) =================
     Tepada afsun bitta buyumni qanday o'zgartirgani ko'rinadi (A -> A'); xuddi shu afsun ikkinchi buyumni (B) nimaga
     aylantirishini variantlardan tanlash kerak. Buyumning besh belgisi: turi (olti buyum, doira bo'ylab), soni (1-3),
     hajmi (uch xil), burilishi (90 gradusdan), nuri (uch rang). Qoida = bir nechta belgining o'zgarishi.
     Darslar (bot: TRANS_DARS = 36): 1-12 - bitta o'zgarish, 4 variant; 13-24 - ikkita o'zgarish birdan; 25-36 - uchta
     o'zgarish, 6 variant. Chalg'ituvchilar - qoidaning yarmi, teskarisi yoki o'zgarmagan buyum. Har savolga bitta
     urinish, sham = vaqt. Baho: to'g'ri javoblar ulushi (90 / 78 / 60). Bellashuv: 8 savol (ikki o'zgarishli), hammaga
     bir xil (mavzu t1..t12 dan urug'), xato +3 s. Eslab qolish yo'q - bu mantiq mashqi. */
  var TF_OBJ = ["choynak", "qadah", "qongiz", "sichqon", "tipratikan", "pat"];
  var TF_NUR = ["243,213,143", "120,175,255", "240,110,100"];
  var TF_OP = [{ k: "r", d: 1 }, { k: "r", d: 2 }, { k: "s", d: 1 }, { k: "s", d: -1 }, { k: "n", d: 1 }, { k: "n", d: -1 }, { k: "c", d: 1 }, { k: "o", d: 1 }, { k: "o", d: 2 }];
  var tf = null;      // {n, bell, savol:[{a, a2, b, opts:[item], ok}], i, ok, t0, lim, tm, lock}
  function tfMgImg(k) { return IMG_DIR + "makgonagall/" + k + ".webp"; }
  function tfKayf(k) { ["tf-mg-im", "tf-mg-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = tfMgImg(k); } }); }
  function tfStop() { if (tf) { clearInterval(tf.tm); tf.tm = 0; } }
  function tfQolla(it, qoida) {
    var q = { o: it.o, c: it.c, s: it.s, n: it.n, r: it.r };
    qoida.forEach(function (op) {
      if (op.k === "o") { q.o = (q.o + op.d + 6) % 6; } else if (op.k === "c") { q.c = (q.c + op.d + 3) % 3; }
      else if (op.k === "r") { q.r = (q.r + op.d + 4) % 4; } else if (op.k === "s") { q.s += op.d; } else { q.n += op.d; }
    });
    return q;
  }
  function tfYaroqli(q) { return q.s >= 0 && q.s <= 2 && q.n >= 1 && q.n <= 3; }
  function tfKalit(q) { return [q.o, q.c, q.s, q.n, q.r].join("-"); }
  function tfEl(q, cls) {
    var d = drEl("div", "tf-it" + (cls ? " " + cls : ""));
    d.style.setProperty("--tf", TF_NUR[q.c]);
    for (var i = 0; i < q.n; i++) {
      var im = document.createElement("img");
      im.alt = ""; im.src = IMG_DIR + "trans/" + TF_OBJ[q.o] + ".webp";
      im.style.height = [26, 38, 50][q.s] + "%";
      im.style.transform = "rotate(" + q.r * 90 + "deg)";
      d.appendChild(im);
    }
    return d;
  }
  function tfPlan(n, urug, rek) {
    var bell = urug != null, s0 = rek ? Math.floor(Math.random() * 90000) : bell ? urug : n * 83, soni = rek ? 150 : bell ? 8 : 5 + Math.min(3, Math.floor((n - 1) / 9));
    var m = bell ? 2 : n <= 12 ? 1 : n <= 24 ? 2 : 3, var_ = !bell && n > 24 ? 6 : 4, savol = [], i, g, k;
    var rnd = function (z) { return afRnd(s0 + z * 3.17); };
    var tasodif = function (z) { return { o: Math.floor(rnd(z) * 6), c: Math.floor(rnd(z + 1) * 3), s: Math.floor(rnd(z + 2) * 3), n: 1 + Math.floor(rnd(z + 3) * 3), r: Math.floor(rnd(z + 4) * 4) }; };
    for (i = 0; i < soni; i++) {
      if (rek) { m = i < 5 ? 1 : i < 15 ? 2 : 3; var_ = i < 15 ? 4 : 6; }
      var z = i * 97, qoida = [], band = {}, a, b;
      g = 0;
      while (qoida.length < m && g < 80) { var op = TF_OP[Math.floor(rnd(z + 10 + g) * TF_OP.length)]; g++; if (!band[op.k]) { band[op.k] = 1; qoida.push(op); } }
      g = 0;
      do { a = tasodif(z + 200 + g * 5); g++; } while (!tfYaroqli(tfQolla(a, qoida)) && g < 60);
      g = 0;
      do { b = tasodif(z + 600 + g * 5); g++; } while ((!tfYaroqli(tfQolla(b, qoida)) || b.o === a.o) && g < 80);
      var togri = tfQolla(b, qoida), opts = [togri], bor = {};
      bor[tfKalit(togri)] = 1;
      var nomzod = [b];                                              // o'zgarmagan buyum
      qoida.forEach(function (op2) { if (m > 1) { nomzod.push(tfQolla(b, [op2])); } nomzod.push(tfQolla(b, qoida.filter(function (x) { return x !== op2; }).concat([{ k: op2.k, d: -op2.d }]))); });
      for (k = 0; k < 14; k++) {                                     // to'g'ri javobning bitta belgisi boshqacha
        var bel = ["o", "c", "s", "n", "r"][Math.floor(rnd(z + 900 + k * 2) * 5)];
        nomzod.push(tfQolla(togri, [{ k: bel, d: rnd(z + 901 + k * 2) < 0.5 ? 1 : -1 }]));
      }
      nomzod.forEach(function (q) { if (opts.length < var_ && tfYaroqli(q) && !bor[tfKalit(q)]) { bor[tfKalit(q)] = 1; opts.push(q); } });
      for (g = opts.length - 1; g > 0; g--) { var j = Math.floor(rnd(z + 1200 + g) * (g + 1)), t = opts[g]; opts[g] = opts[j]; opts[j] = t; }
      savol.push({ a: a, a2: tfQolla(a, qoida), b: b, opts: opts, ok: opts.indexOf(togri) });
    }
    return { savol: savol, lim: bell ? 0 : Math.round(Math.max(7000, 15000 - n * 200)) };
  }
  function tfOpen(bell, n) {
    var st = drData && drData.trans, x = drX(), f = drFan("trans"), urug = null, i;
    if (bell === true) { var it = String((st && st.contest && st.contest.item) || "t1"); urug = 0; for (i = 0; i < it.length; i++) { urug += it.charCodeAt(i) * (i + 17); } }
    var plan = tfPlan(n || 1, urug, bell === "rek");
    tfStop();
    tf = { n: n || 1, bell: bell === true, rek: bell === "rek", savol: plan.savol, lim: plan.lim, i: 0, ok: 0, t0: 0, tm: 0, lock: false };
    drShowGame("scr-trans");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var im = new Image(); im.src = tfMgImg(k); });
    TF_OBJ.forEach(function (k) { var im = new Image(); im.src = IMG_DIR + "trans/" + k + ".webp"; });
    $("tf-kick").textContent = f.nom[lang];
    $("tf-ttl").textContent = f.ust[lang];
    $("tf-today").textContent = tf.rek ? x.rekT : tf.bell ? x.bell : x.lvl(tf.n);
    $("tf-res").classList.add("hidden");
    $("tf-stage").classList.add("hidden");
    $("tf-intro").classList.toggle("hidden", tf.bell || tf.rek);
    if (tf.bell || tf.rek) { tfGo(); return; }
    $("tf-intro-t").textContent = x.tfI[tf.n <= 12 ? 0 : tf.n <= 24 ? 1 : 2];
    $("tf-go").textContent = x.tfGo;
    tfKayf("maslahat");
  }
  function tfGo() {
    $("tf-intro").classList.add("hidden");
    $("tf-stage").classList.remove("hidden");
    $("tf-sham").classList.toggle("hidden", tf.bell);
    tf.i = 0;
    tfStep();
  }
  function tfHead() {
    var x = drX();
    $("tf-step").textContent = (tf.rek ? x.rekT + " · " + tf.ok : x.tfStep(Math.min(tf.i + 1, tf.savol.length), tf.savol.length)) + (bl && tf.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
  }
  function tfStep() {
    var x = drX(), me = tf, q = tf.savol[tf.i], qoida = $("tf-qoida"), box = $("tf-opts");
    tf.lock = false;
    if (tf.rek) { tf.lim = Math.max(4500, 12000 - tf.i * 300); }
    qoida.innerHTML = "";
    var q1 = drEl("div", "tf-qator"), q2 = drEl("div", "tf-qator");
    q1.appendChild(tfEl(q.a)); q1.appendChild(drEl("span", "tf-ok", "→")); q1.appendChild(tfEl(q.a2));
    q2.appendChild(tfEl(q.b)); q2.appendChild(drEl("span", "tf-ok", "→")); q2.appendChild(drEl("div", "tf-it savol", "?"));
    qoida.appendChild(q1); qoida.appendChild(q2);
    box.className = "tf-opts" + (q.opts.length > 4 ? " olti" : "");
    box.innerHTML = "";
    q.opts.forEach(function (o, k) {
      var b = drEl("button", "tf-o");
      b.type = "button";
      b.appendChild(tfEl(o));
      b.addEventListener("click", function () { tfPick(k, b); });
      box.appendChild(b);
    });
    $("tf-hint").textContent = x.tfHint;
    $("tf-hint").classList.remove("bad");
    tfKayf("maslahat");
    $("tf-sham-w").style.width = "100%";
    $("tf-sham").classList.remove("ochdi", "oz");
    tfHead();
    tf.t0 = Date.now();
    clearInterval(tf.tm);
    tf.tm = setInterval(function () {
      if (tf !== me || $("scr-trans").classList.contains("hidden")) { clearInterval(me.tm); return; }
      if (tf.bell) { tfHead(); return; }
      if (tf.lock) { return; }
      var p = Math.max(0, 1 - (Date.now() - tf.t0) / tf.lim);
      $("tf-sham-w").style.width = (p * 100).toFixed(1) + "%";
      $("tf-sham").classList.toggle("oz", p > 0 && p < 0.3);
      $("tf-sham").classList.toggle("ochdi", p <= 0);
      if (p <= 0) { tfPick(-1, null); }
    }, 100);
  }
  function tfPick(k, btn) {
    if (!tf || tf.lock) { return; }
    var x = drX(), me = tf, q = tf.savol[tf.i], togri = k === q.ok;
    tf.lock = true;
    var bs = $("tf-opts").children;
    if (bs[q.ok]) { bs[q.ok].classList.add("togri"); }
    if (togri) {
      tf.ok++;
      $("tf-hint").textContent = x.tfOk[tf.i % x.tfOk.length];
      $("tf-hint").classList.remove("bad");
      tfKayf((Date.now() - tf.t0) < (tf.lim || 8000) * 0.5 ? "zor" : "yaxshi");
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    } else {
      if (btn) { btn.classList.add("xato"); }
      if (bl && tf.bell) { bl.xato++; }
      $("tf-hint").textContent = k < 0 ? x.tfLate : x.tfBad;
      $("tf-hint").classList.add("bad");
      tfKayf("xafa");
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    }
    setTimeout(function () {
      if (tf !== me) { return; }
      if (tf.rek && !togri) { tfStop(); $("tf-stage").classList.add("hidden"); rekEnd("trans", tf.ok, $("tf-res")); return; }
      tf.i++;
      if (tf.i >= tf.savol.length) { tfEnd(); return; }
      tfStep();
    }, tf.bell ? 500 : togri ? 1000 : 1700);
  }
  function tfEnd() {
    var x = drX(), me = tf, daraja = tf.n, box = $("tf-res"), jami = tf.savol.length;
    tfStop();
    $("tf-stage").classList.add("hidden");
    if (tf.rek) { rekEnd("trans", tf.ok, box); return; }
    if (tf.bell) { blFinish(box); return; }
    var s = Math.round(100 * tf.ok / jami), baho = s >= 90 ? 5 : s >= 78 ? 4 : s >= 60 ? 3 : s >= 40 ? 2 : 1;
    var sc = { baho: baho, izoh: x.tfStat(tf.ok, jami) }, otdi = baho >= 3;
    var show = function (yangi) {
      if (tf !== me) { return; }
      if (otdi) { drResult(box, "«" + x.tfB[baho - 1] + "»", "trans", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.tfB[baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { tfOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { tf = null; fanOpen("trans"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = tfMgImg(baho >= 5 ? "zor" : baho === 4 ? "yaxshi" : baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.tfMgN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("trans", daraja, baho); drDone("trans", daraja, show); } else { show(null); }
  }

  /* ================= QOBILIYATLAR: har fan boshqa qobiliyatni mashq qildiradi (egasi, 2026-10-08) =================
     «Brain games»dagi kabi: odam qaysi sohasi kuchli, qaysisi ustida ishlash kerakligini ko'radi. Daraja (0-100) =
     70% o'tilgan darslar ulushi + 30% shu darslardagi o'rtacha baho (baho shu qurilmada - DR_BAHO_K; bahosi yo'q fanda
     faqat darslar). Xotira ikki fandan (Damlamalar, Maxluqlar) o'rtacha. Yangi fan qo'shilsa QOB ga yozing. */
  var QOB = [
    { id: "bilim", fan: ["tarix"], nom: ["Bilim", "Знания", "Knowledge"] },
    { id: "aniqlik", fan: ["afsun"], nom: ["Qo'l aniqligi", "Точность руки", "Precision"] },
    { id: "xotira", fan: ["iksir", "maxluq"], nom: ["Xotira", "Память", "Memory"] },
    { id: "tezlik", fan: ["himoya"], nom: ["Tezlik", "Скорость", "Speed"] },
    { id: "koord", fan: ["uchish"], nom: ["Koordinatsiya", "Координация", "Coordination"] },
    { id: "fazo", fan: ["astro"], nom: ["Fazoviy tasavvur", "Пространство", "Spatial sense"] },
    { id: "diqqat", fan: ["osimlik"], nom: ["Diqqat", "Внимание", "Attention"] },
    { id: "mantiq", fan: ["trans"], nom: ["Mantiq", "Логика", "Logic"] }
  ];
  function qobFanBall(fan) {
    var st = drData && drData[fan];
    if (!st || !st.total) { return 0; }
    var ul = Math.min(1, st.level / st.total), jam = 0, son = 0, b;
    if (st.gn) { jam = st.gs; son = st.gn; }                        // server (boshqalar ham shuni ko'radi)
    else if (DR_BAHO_K[fan]) { for (var k = 1; k <= st.level; k++) { b = drBahoGet(fan, k); if (b) { jam += b; son++; } } }
    return Math.round(100 * (0.7 * ul + 0.3 * (son ? ul * (jam / son - 1) / 4 : ul)));
  }
  function qobBall(q) { var j = 0; q.fan.forEach(function (f) { j += qobFanBall(f); }); return Math.round(j / q.fan.length); }
  function qobOpen() {
    drShowGame("scr-qob");
    qobRender();
  }
  function qobRender() {
    var x = drX(), li = lang === "ru" ? 1 : lang === "en" ? 2 : 0, N = QOB.length, i, a, nuq = "", tur = "", yoz = "", eng = null;
    var ball = QOB.map(qobBall);
    $("qo-kick").textContent = x.qobK;
    $("qo-ttl").textContent = x.qobT;
    $("qo-note").textContent = x.qobS;
    for (var h = 1; h <= 4; h++) {       // to'r halqalari
      var hal = "";
      for (i = 0; i < N; i++) { a = -Math.PI / 2 + i * 2 * Math.PI / N; hal += (i ? "L" : "M") + (110 + Math.cos(a) * 70 * h / 4).toFixed(1) + " " + (110 + Math.sin(a) * 70 * h / 4).toFixed(1); }
      tur += '<path class="qo-tur" d="' + hal + 'Z"/>';
    }
    for (i = 0; i < N; i++) {
      a = -Math.PI / 2 + i * 2 * Math.PI / N;
      var r = 70 * Math.max(4, ball[i]) / 100;
      nuq += (i ? "L" : "M") + (110 + Math.cos(a) * r).toFixed(1) + " " + (110 + Math.sin(a) * r).toFixed(1);
      tur += '<path class="qo-oq" d="M110 110L' + (110 + Math.cos(a) * 70).toFixed(1) + " " + (110 + Math.sin(a) * 70).toFixed(1) + '"/>';
      var tx = 110 + Math.cos(a) * 90, ty = 110 + Math.sin(a) * 84;
      yoz += '<text x="' + tx.toFixed(1) + '" y="' + (ty + 3).toFixed(1) + '" text-anchor="' + (Math.abs(Math.cos(a)) < 0.3 ? "middle" : Math.cos(a) > 0 ? "start" : "end") + '">' + QOB[i].nom[li] + "</text>";
      if (eng == null || ball[i] < ball[eng]) { eng = i; }
    }
    $("qo-radar").innerHTML = '<svg viewBox="-34 0 288 220" aria-hidden="true">' + tur + '<path class="qo-shakl" d="' + nuq + 'Z"/>' + yoz + "</svg>";
    var box = $("qo-list");
    box.innerHTML = "";
    QOB.forEach(function (q, j) {
      var row = drEl("button", "qo-row"), fanlar = q.fan.map(function (f) { return drFan(f).nom[lang]; }).join(" · ");
      row.type = "button";
      var t = drEl("span", "qo-tx");
      t.appendChild(drEl("b", "", q.nom[li]));
      t.appendChild(drEl("small", "", fanlar + " · " + x.qobUn[ball[j] >= 90 ? 4 : ball[j] >= 65 ? 3 : ball[j] >= 35 ? 2 : ball[j] >= 10 ? 1 : 0]));
      var bar = drEl("span", "qo-bar"), bi = drEl("i");
      bi.style.width = ball[j] + "%";
      bar.appendChild(bi);
      t.appendChild(bar);
      row.appendChild(t);
      row.appendChild(drEl("span", "qo-n", String(ball[j])));
      row.addEventListener("click", function () { fanOpen(q.fan[0]); });
      box.appendChild(row);
    });
    var zf = QOB[eng], zfan = zf.fan.slice().sort(function (p, q2) { return qobFanBall(p) - qobFanBall(q2); })[0];
    $("qo-zaif").textContent = x.qobZaif(zf.nom[li]);
    $("qo-go").textContent = x.qobGo(drFan(zfan).nom[lang]);
    $("qo-go").onclick = function () { fanOpen(zfan); };
    $("qo-esl").textContent = x.qobEsl;
  }

  function drSetup() {
    $("dr-back").addEventListener("click", function () { $("scr-dars").classList.add("hidden"); drQayt = false; try { openHub(); } catch (e) {} });
    $("af-back").addEventListener("click", function () { var b = af && af.bell; af = null; blAbort(); if (b) { blOpen("afsun"); } else if (rekFan) { rekQayt(); } else { fanOpen("afsun"); } });
    $("ik-back").addEventListener("click", function () { var b = ik && ik.bell; ikStop(); ik = null; blAbort(); if (b) { blOpen("iksir"); } else if (rekFan) { rekQayt(); } else { fanOpen("iksir"); } });
    $("hm-back").addEventListener("click", function () { var b = hm && hm.bell; hmStop(); hm = null; blAbort(); if (b) { blOpen("himoya"); } else if (rekFan) { rekQayt(); } else { fanOpen("himoya"); } });
    $("hm-go").addEventListener("click", function () { if (hm) { hmGo(); } });
    $("uc-back").addEventListener("click", function () { var b = uch && uch.bell; uchStop(); uch = null; blAbort(); if (b) { blOpen("uchish"); } else if (rekFan) { rekQayt(); } else { fanOpen("uchish"); } });
    $("uc-go").addEventListener("click", function () { if (uch) { uchGo(); } });
    $("mx-back").addEventListener("click", function () { var b = mx && mx.bell; mxStop(); mx = null; blAbort(); if (b) { blOpen("maxluq"); } else if (rekFan) { rekQayt(); } else { fanOpen("maxluq"); } });
    $("mx-go").addEventListener("click", function () { if (mx) { mxGo(); } });
    $("qr-back").addEventListener("click", function () { if (qrKel === "hub") { qrKel = "fan"; $("scr-qoriq").classList.add("hidden"); openHub(); } else { fanOpen("maxluq"); } });
    $("yl-back").addEventListener("click", function () { var b = yl && yl.bell; ylStop(); yl = null; blAbort(); if (b) { blOpen("astro"); } else if (rekFan) { rekQayt(); } else { fanOpen("astro"); } });
    $("yl-go").addEventListener("click", function () { if (yl) { ylGo(); } });
    $("os-back").addEventListener("click", function () { var b = os && os.bell; osStop(); os = null; blAbort(); if (b) { blOpen("osimlik"); } else if (rekFan) { rekQayt(); } else { fanOpen("osimlik"); } });
    $("os-go").addEventListener("click", function () { if (os) { osGo(); } });
    $("tf-back").addEventListener("click", function () { var b = tf && tf.bell; tfStop(); tf = null; blAbort(); if (b) { blOpen("trans"); } else if (rekFan) { rekQayt(); } else { fanOpen("trans"); } });
    $("tf-go").addEventListener("click", function () { if (tf) { tfGo(); } });
    $("qo-back").addEventListener("click", function () { if (qobKel === "pm") { qobKel = "dars"; $("scr-qob").classList.add("hidden"); pmOpen(); } else { drOpen(); } });
    $("dr-qob").addEventListener("click", function () { qobKel = "dars"; qobOpen(); });
    $("rk-back").addEventListener("click", function () { if (rekKel === "fan" && rekSahifa) { fanOpen(rekSahifa); } else { blHomeOpen("rek"); } });
    $("rk-go").addEventListener("click", function () { if (rekSahifa) { rekBosh(rekSahifa); } });
    $("fn-qr").addEventListener("click", function () { if (fanId === "osimlik") { isKel = "fan"; isOpen(); } else { qrKel = "fan"; qrOpen(); } });
    var uc = $("uc-canvas"), ucYur = function (ev) {
      if (!uch || uch.over) { return; }
      var r = uc.getBoundingClientRect(), W = uch.w * 0.84;
      uch.tx = Math.max(0.05, Math.min(0.95, (ev.clientX - r.left - (uch.w - W) / 2) / W));
      try { ev.preventDefault(); } catch (e) {}
    };
    if (window.PointerEvent) { uc.addEventListener("pointerdown", ucYur); uc.addEventListener("pointermove", ucYur); }
    else {
      var ucT = function (ev) { var t = ev.touches && ev.touches[0]; if (t) { ucYur({ clientX: t.clientX, preventDefault: function () { ev.preventDefault(); } }); } };
      uc.addEventListener("touchstart", ucT, { passive: false }); uc.addEventListener("touchmove", ucT, { passive: false });
    }
    $("tr-back").addEventListener("click", function () { var b = tr && tr.bell; tr = null; blAbort(); if (b) { blOpen("tarix"); } else if (rekFan) { rekQayt(); } else { fanOpen("tarix"); } });
    $("bl-back").addEventListener("click", function () {
      blAbort();
      try { if (sqBack()) { $("scr-bell").classList.add("hidden"); return; } } catch (e) {}     // Shokolad qurbaqa topshirig'idan kelingan
      if (blKel === "fan" && blFan) { fanOpen(blFan); } else { blHomeOpen("bell"); }
    });
    $("blh-back").addEventListener("click", function () { $("scr-blh").classList.add("hidden"); blQayt = false; try { openHub(); } catch (e) {} });
    $("fn-back").addEventListener("click", function () { drOpen(); });
    $("bl-go").addEventListener("click", blStart);
    $("ik-go").addEventListener("click", function () { if (ik) { ik.msg = ""; ikStart(); } });
    $("af-show").addEventListener("click", function () { if (af && !af.done) { af.show = true; af.used = true; af.trail = []; afPaint(); } });
    var c = $("af-canvas");
    if (window.PointerEvent) {
      c.addEventListener("pointerdown", afDown);
      c.addEventListener("pointermove", afMove);
      c.addEventListener("pointerup", afUp);
      c.addEventListener("pointercancel", afUp);
      c.addEventListener("pointerleave", afUp);
    } else {
      var tch = function (fn) { return function (ev) { var t = ev.changedTouches && ev.changedTouches[0]; if (t) { fn({ clientX: t.clientX, clientY: t.clientY, preventDefault: function () { ev.preventDefault(); } }); } }; };
      c.addEventListener("touchstart", tch(afDown), { passive: false });
      c.addEventListener("touchmove", tch(afMove), { passive: false });
      c.addEventListener("touchend", function () { afUp(); });
    }
    window.addEventListener("resize", function () { if (af && !$("scr-afsun").classList.contains("hidden")) { af.trail = []; afSize(); afPaint(); } });
  }

  drSetup();
