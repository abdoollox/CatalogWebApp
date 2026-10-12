/* Fanlar yo'riqnomasi (egasi, 2026-10-11: Transfiguratsiyadagi yo'riqnoma yaxshi chiqdi - qolgan sakkiz fanga ham shunday).
   Har fanning birinchi darsida - darsning O'ZIDA, birinchi topshiriq ustida - professor qadam-baqadam ko'rsatadi:
   nimaga qarash, qayerni bosish, vaqt qanday ketadi; oxirgi qadamni o'quvchi o'zi bajaradi. Yo'riqnoma paytida o'yin
   (sham, yaqinlashayotgan xavf, supurgi, o'simliklar) TO'XTAB turadi - har o'yinda shunday tekshiruv bor: <o'yin>.yoriq.
   Darsning mexanikasi o'zgaradigan bosqichlarga (masalan, Afsunlarda 25-darsdan «vaziyat») alohida qisqa yo'riqnoma.
   Har bosqich bir marta (belgi hp_fy_<fan>_<tur>, shu qurilmada); «Qanday bajariladi?» havolasi qayta ochadi.
   Dvigatel: yqOch (09-yoriqnoma.js). Transfiguratsiyaniki alohida - tfYoriq (09-darslar.js). Bellashuv va rekordda chiqmaydi.
   Dars ekrani o'zgarsa (id, klass) shu fayldagi qadamlarni ham yangilang. */
"use strict";

  var FY_TURLAR = { tarix: ["asos"], afsun: ["asos", "vaz", "zan"], iksir: ["asos", "imt"], himoya: ["asos"],
                    uchish: ["asos", "bld", "sn"], maxluq: ["asos", "kor"], astro: ["asos", "aks", "sil"], osimlik: ["asos", "as3", "t6", "as4"] };
  var FY_TX = {
    uz: { qanday: "Qanday bajariladi?", binns: "Professor Binns",
          tr1: "Har savolga bitta chiziqcha. To'g'ri javob yashil, xato qizil bo'lib yonadi. Dars o'tishi uchun HAMMASI yashil bo'lishi kerak.",
          tr2: "Mana savol. Shoshilmang — bu darsda vaqt chegarasi yo'q.",
          tr3: "Javoblardan faqat bittasi to'g'ri. Tanlaganingizni bosing — to'g'rimi yoki yo'qligini darhol aytaman.",
          tr4: "Xato bo'lsa, to'g'ri javob yashil bo'lib ko'rinadi — eslab qoling. Dars o'tmasa, qaytadan urinasiz: savollar o'sha qoladi.",
          af1: function (a) { return "Bugungi afsun — «" + a + "». Nomi va nima qilishi shu yerda yozilgan."; },
          af2: "Bu — chizish maydoni. Yorug' nuqta — boshlanish, o'qchalar — yo'nalish, yulduzcha — oxiri.",
          af3: "Har afsun uch marta chiziladi: avval chiziq aniq ko'rinadi, keyin xira bo'ladi, uchinchisida — yoddan.",
          af4: "Sham — vaqt. Chiza boshlaganingizda yonadi. O'chsa ham urinish kuymaydi, faqat baho pasayadi.",
          af5: "Endi o'zingiz: barmog'ingizni yorug' nuqtaga qo'ying va uzmasdan chiziq bo'ylab yulduzchagacha torting.",
          af6: "Barakalla! Chiziqdan uzoqlashsangiz, iz qizaradi va qaytadan chizasiz. Uch urinishdan keyin baho qo'yaman: kamida «Qoniqarli» bo'lsa, dars o'tadi.",
          vz1: "Yangi bosqich: endi afsun nomi aytilmaydi. Vaziyat yoziladi — qaysi afsun yordam berishini o'zingiz topasiz.",
          vz2: "To'rtta afsundan bittasi to'g'ri. Xato tanlov bahoni pasaytiradi.",
          vz3: function (a) { return "Bu vaziyatda «" + a + "» yordam beradi. Uni bosing."; },
          vz4: "Endi uni yoddan chizing — chiziq ko'rsatilmaydi. Yorug' nuqtadan boshlang.",
          zn1: "Yangi bosqich: uchta afsun ketma-ket, hammasi yoddan. Hozirgisining nomi tepada yoziladi.",
          zn2: "Diqqat: sham bitta — uchala afsunga. Birinchi chizishdan yonadi va afsunlar orasida to'xtamaydi.",
          zn3: "Boshladik! Yorug' nuqtadan birinchi afsunni chizing.", chiz: "Chizing",
          ik1: "Bu — retsept. Masalliqlar aynan shu tartibda qozonga solinadi. Tartibni yaxshilab eslab qoling.",
          ik2: "Har nuqta — bitta masalliq. To'g'ri solganingiz sari ular yonadi.",
          ik3: "Tayyor bo'lsangiz, shu tugmani bosing. Retsept yopiladi — keyin yoddan solasiz.",
          ik4: "Mana masalliqlar. Orasida retseptda yo'qlari ham bor — adashmang.",
          ik5: "Sham — vaqt. Hozir u to'xtab turibdi.",
          ik6: function (n) { return "Xatolar shu yerda sanaladi. " + n + " ta xato qilsangiz, damlama buziladi va retsept qaytadan ko'rsatiladi."; },
          ik7: function (m) { return "Birinchi masalliq — «" + m + "». Uni toping va bosing. Qolganini o'zingiz solasiz."; },
          im1: "Imtihon! Endi retsept bir necha soniyadan keyin O'ZI yopiladi. Sanoq «Keyingi»ni bosganingizdan keyin boshlanadi.",
          im2: "Yodlab olsangiz, kutmasdan shu tugmani bosishingiz ham mumkin. Mening sinfimda xatoga joy yo'q.",
          hm1: "Xavf uzoqdan yaqinlashib kelyapti. U yetib kelguncha himoya afsunini tanlashingiz kerak.",
          hm2: function (a) { return "Bu — «" + a + "». Qanday xavf ekani shu yerda yozilgan."; },
          hm3: "Sham — vaqt: xavf qanchalik yaqinlashganini ko'rsatadi. Hozir u to'xtab turibdi.",
          hm4: "Uchta qalqon — jonlaringiz. Xato tanlov yoki kechikish bittasini oladi. Hammasi ketsa, dars o'tmaydi.",
          hm5: function (a, b) { return "«" + a + "»ga qarshi «" + b + "» yordam beradi. Uni bosing."; },
          uc1: "Supurgi o'zi oldinga uchadi — siz faqat yo'nalishni boshqarasiz: barmog'ingizni maydonda o'ngga-chapga suring. Hozir sinab ko'rsangiz bo'ladi.",
          uc2: "Oltin halqalardan o'ting. Halqa o'rtasidagi nuqtaga qanchalik yaqin o'tsangiz, supurgi shunchalik tezlashadi.",
          uc3: "Bu yerda nechanchi halqa ekani va tezligingiz (masalan, ×1.16) ko'rinadi. Tezlik o'zi asta so'nadi — aniq uchib tursangiz saqlanadi; halqani o'tkazib yuborsangiz, keskin tushadi.",
          uc4: "Bugun maydonda BLADJERLAR — qora to'plar. Ularga urilsangiz, supurgi sekinlashadi.",
          uc5: "Har zarba bitta yurakni oladi. Uchta yurak ketsa — dars tugaydi.",
          uc6: "Oltin SNITCH ham uchib o'tadi — u o'ngga-chapga tebranib yuradi. Tutib olsangiz, bahoyingiz oshadi.",
          uc7: "Tayyormisiz? Barmog'ingizni maydonga qo'ying — uchamiz!", ucB: "Maydonga teging",
          mx1: "Kartalar bir necha soniya ochiq turadi: har maxluq va uning yemishi. Qaysi karta qayerdaligini eslab qoling.",
          mx2: function (a) { return "Masalan, bu — «" + a + "»…"; },
          mx3: function (b) { return "…uning yemishi esa — «" + b + "». U mana shu yerda."; },
          mx4: "Sham — vaqt. Kartalar yopilgach yonadi.",
          mx5: function (a) { return "Kartalar yopildi. «" + a + "» mana shu yerda edi — kartani bosing."; },
          mx6: "Endi uning yemishi turgan kartani oching.",
          mk1: "Yangi bosqich: endi kartalar oldindan ko'rsatilmaydi. Ikkitadan ochib, o'zingiz qidirasiz.",
          mk2: "Maxluq va uning yemishi chiqsa — juftlik. Bo'lmasa, kartalar yopiladi: nima qayerda ekanini eslab boring.",
          yl1: function (a) { return "Tepada — namuna: «" + a + "» turkumi. Yulduzlar bir-biriga nisbatan qanday joylashganiga qarang."; },
          yl2: "Pastdagi shakllardan faqat bittasi — aynan shu turkum, lekin boshqa tomonga BURILGAN. Qolganlari — boshqa turkumlar.",
          yl3: "Sham — vaqt. Hozir u to'xtab turibdi.",
          yl4: "Ehtiyot bo'ling! Bu — turkumning KO'ZGUDAGI AKSI: o'ng va chap almashgan. Qanday bursangiz ham namunaga tushmaydi — bu xato javob.",
          yl4b: "Endi ehtiyot bo'ling: ba'zi shakllar turkumning ko'zgudagi aksi bo'ladi — o'ng va chap almashgan. Ular xato javob.",
          yl5: "Bu ham tuzoq: turkumning o'zi, lekin BITTA YULDUZI joyidan siljigan. Har yulduzni tekshiring.",
          yl6: "Mana to'g'ri javob: yulduzlar joylashuvi o'sha, faqat burilgan. Uni bosing.",
          os1: "Bu — issiqxona. O'simliklar birin-ketin parvarish so'raydi.",
          os2: function (a) { return "Mana: bu o'simlikka «" + a + "» kerak — ustidagi belgi shuni aytadi. Ostidagi chiziq — u qancha kuta olishi."; },
          os3: function (a) { return "Avval pastdan kerakli asbobni tanlang — «" + a + "»ni bosing."; },
          os4: "Endi o'simlikni bosing.",
          os5: "Ulgurmasangiz, o'simlik so'liydi va bitta barg ketadi — uchta barg, uchta jon. Noto'g'ri asbob esa bahoni pasaytiradi.",
          os6: function (a) { return "Yangi asbob — «" + a + "». O'simlik ustida shu belgi chiqsa, uni tanlaysiz."; },
          os7: "Endi tuvaklar oltita. Ko'zingiz hammasida bo'lsin.",
          os8: "Endi o'zingiz: qaysi o'simlik nima so'rasa, o'shani bering. Omad!" },
    ru: { qanday: "Как это делается?", binns: "Профессор Биннс",
          tr1: "Каждому вопросу — своя чёрточка. Верный ответ загорается зелёным, ошибка — красным. Чтобы пройти урок, зелёными должны быть ВСЕ.",
          tr2: "Вот вопрос. Не спешите — на этом уроке времени не ограничено.",
          tr3: "Верен только один ответ. Нажмите на выбранный — я сразу скажу, правильно ли.",
          tr4: "При ошибке верный ответ подсветится зелёным — запомните его. Не прошли урок — попробуете снова: вопросы те же.",
          af1: function (a) { return "Сегодняшнее заклинание — «" + a + "». Его название и действие написаны здесь."; },
          af2: "Это поле для рисования. Светлая точка — начало, стрелки — направление, звёздочка — конец.",
          af3: "Каждое заклинание рисуется трижды: сначала линия видна чётко, потом бледнее, в третий раз — по памяти.",
          af4: "Свеча — это время. Она загорается, когда вы начинаете рисовать. Если погаснет, попытка не сгорит — просто снизится оценка.",
          af5: "Теперь сами: поставьте палец на светлую точку и, не отрывая, ведите по линии до звёздочки.",
          af6: "Молодец! Если уйти далеко от линии, след покраснеет и придётся начать заново. После трёх попыток я поставлю оценку: от «Удовлетворительно» и выше — урок пройден.",
          vz1: "Новый этап: теперь название заклинания не говорится. Описана ситуация — какое заклинание поможет, решаете вы.",
          vz2: "Из четырёх заклинаний верно одно. Неверный выбор снижает оценку.",
          vz3: function (a) { return "В этой ситуации поможет «" + a + "». Нажмите на него."; },
          vz4: "Теперь нарисуйте его по памяти — линии не будет. Начните со светлой точки.",
          zn1: "Новый этап: три заклинания подряд, все по памяти. Название текущего написано наверху.",
          zn2: "Внимание: свеча одна на все три заклинания. Она загорается с первого движения и не гаснет между ними.",
          zn3: "Начинаем! Нарисуйте первое заклинание от светлой точки.", chiz: "Рисуйте",
          ik1: "Это рецепт. Ингредиенты кладут в котёл именно в таком порядке. Хорошенько запомните его.",
          ik2: "Каждая точка — один ингредиент. Они загораются по мере того, как вы их кладёте.",
          ik3: "Когда будете готовы, нажмите эту кнопку. Рецепт закроется — дальше по памяти.",
          ik4: "Вот ингредиенты. Среди них есть и лишние — не перепутайте.",
          ik5: "Свеча — это время. Сейчас она остановлена.",
          ik6: function (n) { return "Здесь считаются ошибки. После " + n + " ошибок зелье испортится и рецепт покажут снова."; },
          ik7: function (m) { return "Первый ингредиент — «" + m + "». Найдите его и нажмите. Остальные — сами."; },
          im1: "Экзамен! Теперь рецепт САМ закроется через несколько секунд. Отсчёт начнётся, когда вы нажмёте «Дальше».",
          im2: "Запомнили раньше — можете нажать эту кнопку, не дожидаясь. На моих уроках ошибкам не место.",
          hm1: "Опасность приближается издалека. Пока она не подошла, нужно выбрать защитное заклинание.",
          hm2: function (a) { return "Это — «" + a + "». Чем она опасна, написано здесь."; },
          hm3: "Свеча — это время: показывает, насколько близко опасность. Сейчас она остановлена.",
          hm4: "Три щита — ваши жизни. Неверный выбор или опоздание отнимают один. Кончатся все — урок не пройден.",
          hm5: function (a, b) { return "Против «" + a + "» поможет «" + b + "». Нажмите на него."; },
          uc1: "Метла летит вперёд сама — вы только направляете её: ведите пальцем по полю влево и вправо. Можно попробовать прямо сейчас.",
          uc2: "Пролетайте через золотые кольца. Чем ближе к точке в центре кольца — тем сильнее ускоряется метла.",
          uc3: "Здесь видно, какое это кольцо и ваша скорость (например, ×1.16). Скорость понемногу гаснет — держите её точными пролётами; пропустите кольцо — она резко упадёт.",
          uc4: "Сегодня на поле БЛАДЖЕРЫ — чёрные мячи. Столкнётесь — метла замедлится.",
          uc5: "Каждый удар отнимает одно сердце. Кончатся три — урок окончен.",
          uc6: "Мимо пролетит золотой СНИТЧ — он виляет влево-вправо. Поймаете — оценка будет выше.",
          uc7: "Готовы? Коснитесь поля — летим!", ucB: "Коснитесь поля",
          mx1: "Несколько секунд карты открыты: каждое существо и его корм. Запомните, где какая карта.",
          mx2: function (a) { return "Например, это — «" + a + "»…"; },
          mx3: function (b) { return "…а его корм — «" + b + "». Он вот здесь."; },
          mx4: "Свеча — это время. Загорится, когда карты закроются.",
          mx5: function (a) { return "Карты закрыты. «" + a + "» был вот здесь — нажмите на карту."; },
          mx6: "Теперь откройте карту с его кормом.",
          mk1: "Новый этап: карты больше не показывают заранее. Открывайте по две и ищите сами.",
          mk2: "Существо и его корм — это пара. Если нет, карты закроются: запоминайте, где что лежит.",
          yl1: function (a) { return "Наверху — образец: созвездие «" + a + "». Посмотрите, как звёзды расположены друг относительно друга."; },
          yl2: "Среди фигур внизу только одна — это же созвездие, но ПОВЁРНУТОЕ. Остальные — другие созвездия.",
          yl3: "Свеча — это время. Сейчас она остановлена.",
          yl4: "Осторожно! Это ЗЕРКАЛЬНОЕ ОТРАЖЕНИЕ созвездия: право и лево поменялись. Как ни поворачивай, с образцом не совпадёт — это неверный ответ.",
          yl4b: "Теперь осторожнее: некоторые фигуры — зеркальное отражение созвездия, право и лево поменялись. Это неверные ответы.",
          yl5: "И это ловушка: то же созвездие, но ОДНА ЗВЕЗДА сдвинута. Проверяйте каждую звезду.",
          yl6: "Вот верный ответ: расположение звёзд то же, только повёрнуто. Нажмите на него.",
          os1: "Это теплица. Растения по очереди просят ухода.",
          os2: function (a) { return "Смотрите: этому растению нужно «" + a + "» — об этом говорит значок над ним. Полоска под ним — сколько оно может ждать."; },
          os3: function (a) { return "Сначала выберите внизу нужный инструмент — нажмите «" + a + "»."; },
          os4: "Теперь нажмите на растение.",
          os5: "Не успеете — растение завянет и пропадёт один лист: три листа — три жизни. Неверный инструмент снижает оценку.",
          os6: function (a) { return "Новый инструмент — «" + a + "». Появится такой значок над растением — выбирайте его."; },
          os7: "Теперь горшков шесть. Следите за всеми.",
          os8: "Теперь сами: что растение просит, то и давайте. Удачи!" },
    en: { qanday: "How does it work?", binns: "Professor Binns",
          tr1: "One dash per question. A right answer lights up green, a wrong one red. To pass the lesson ALL of them must be green.",
          tr2: "Here is the question. No rush — there is no time limit in this lesson.",
          tr3: "Only one answer is correct. Tap your choice — I will tell you straight away whether it is right.",
          tr4: "If you are wrong, the right answer turns green — remember it. If you don't pass, you try again: the questions stay the same.",
          af1: function (a) { return "Today's spell is “" + a + "”. Its name and what it does are written here."; },
          af2: "This is the drawing field. The bright dot is the start, the arrows show the way, the star is the end.",
          af3: "Each spell is drawn three times: first the line is clear, then faint, and the third time from memory.",
          af4: "The candle is your time. It lights when you start drawing. If it burns out the try still counts — only the grade drops.",
          af5: "Your turn: put your finger on the bright dot and, without lifting it, follow the line to the star.",
          af6: "Well done! Stray too far from the line and the trail turns red — then you start again. After three tries I give a grade: “Acceptable” or better passes the lesson.",
          vz1: "New stage: the spell's name is no longer given. A situation is described — you decide which spell helps.",
          vz2: "One of the four spells is right. A wrong pick lowers your grade.",
          vz3: function (a) { return "In this situation “" + a + "” helps. Tap it."; },
          vz4: "Now draw it from memory — no line is shown. Start at the bright dot.",
          zn1: "New stage: three spells in a row, all from memory. The current one's name is at the top.",
          zn2: "Careful: there is one candle for all three spells. It lights with the first stroke and keeps burning between them.",
          zn3: "Here we go! Draw the first spell from the bright dot.", chiz: "Draw",
          ik1: "This is the recipe. The ingredients go into the cauldron in exactly this order. Memorise it well.",
          ik2: "Each dot is one ingredient. They light up as you add them.",
          ik3: "When you are ready, tap this button. The recipe closes — then it's from memory.",
          ik4: "Here are the ingredients. Some of them are not in the recipe — don't mix them up.",
          ik5: "The candle is your time. It is paused for now.",
          ik6: function (n) { return "Mistakes are counted here. After " + n + " mistakes the potion is ruined and you see the recipe again."; },
          ik7: function (m) { return "The first ingredient is “" + m + "”. Find it and tap it. The rest is up to you."; },
          im1: "Exam! The recipe now closes BY ITSELF after a few seconds. The countdown starts when you tap “Next”.",
          im2: "Memorised it sooner? Tap this button without waiting. There is no room for mistakes in my class.",
          hm1: "A danger is approaching from afar. You must choose a defensive spell before it reaches you.",
          hm2: function (a) { return "This is the “" + a + "”. What makes it dangerous is written here."; },
          hm3: "The candle is your time: it shows how close the danger is. It is paused for now.",
          hm4: "Three shields are your lives. A wrong pick or a late one costs a shield. Lose them all and the lesson is not passed.",
          hm5: function (a, b) { return "Against the “" + a + "”, “" + b + "” helps. Tap it."; },
          uc1: "The broom flies forward by itself — you only steer: slide your finger left and right on the field. You can try it now.",
          uc2: "Fly through the golden hoops. The closer you pass to the dot in the centre, the faster the broom goes.",
          uc3: "Here you see which hoop it is and your speed (e.g. ×1.16). Speed fades slowly — keep it up with accurate passes; miss a hoop and it drops sharply.",
          uc4: "Today there are BLUDGERS on the pitch — black balls. Hit one and the broom slows down.",
          uc5: "Each hit costs a heart. Lose all three and the lesson ends.",
          uc6: "The golden SNITCH flies past too — it weaves left and right. Catch it and your grade goes up.",
          uc7: "Ready? Touch the field — let's fly!", ucB: "Touch the field",
          mx1: "For a few seconds the cards are face up: each creature and its food. Remember where each card is.",
          mx2: function (a) { return "For example, this is the “" + a + "”…"; },
          mx3: function (b) { return "…and its food is “" + b + "”. It's right here."; },
          mx4: "The candle is your time. It lights once the cards close.",
          mx5: function (a) { return "The cards are closed. The “" + a + "” was right here — tap the card."; },
          mx6: "Now open the card with its food.",
          mk1: "New stage: the cards are no longer shown in advance. Open two at a time and search yourself.",
          mk2: "A creature and its food make a pair. If not, the cards close again: remember what lies where.",
          yl1: function (a) { return "At the top is the sample: the constellation “" + a + "”. Look at how the stars sit relative to each other."; },
          yl2: "Only one shape below is this very constellation, but ROTATED. The others are different constellations.",
          yl3: "The candle is your time. It is paused for now.",
          yl4: "Careful! This is the constellation's MIRROR IMAGE: left and right are swapped. However you turn it, it won't match — a wrong answer.",
          yl4b: "Careful now: some shapes are the constellation's mirror image — left and right swapped. They are wrong answers.",
          yl5: "Another trap: the same constellation, but ONE STAR has moved. Check every star.",
          yl6: "Here is the right answer: the same arrangement of stars, only rotated. Tap it.",
          os1: "This is the greenhouse. The plants ask for care one after another.",
          os2: function (a) { return "Look: this plant needs “" + a + "” — the sign above it says so. The bar below shows how long it can wait."; },
          os3: function (a) { return "First pick the right tool below — tap “" + a + "”."; },
          os4: "Now tap the plant.",
          os5: "Too slow and the plant wilts and a leaf is lost — three leaves, three lives. The wrong tool lowers your grade.",
          os6: function (a) { return "A new tool — “" + a + "”. When this sign appears above a plant, pick it."; },
          os7: "Now there are six pots. Keep an eye on all of them.",
          os8: "Your turn: give each plant what it asks for. Good luck!" }
  };
  function fyX() { return FY_TX[lang] || FY_TX.uz; }
  function fyKalit(fan, tur) { return TK("hp_fy_" + fan + "_" + tur); }
  function fyKerak(fan, tur) { try { return window.localStorage.getItem(fyKalit(fan, tur)) !== "1"; } catch (e) { return false; } }
  function fyQoy(fan, tur) { try { window.localStorage.setItem(fyKalit(fan, tur), "1"); } catch (e) {} }
  function fyOchir(fan) { (FY_TURLAR[fan] || []).forEach(function (t) { try { window.localStorage.removeItem(fyKalit(fan, t)); } catch (e) {} }); }
  function fyEl(sel) { return function () { return document.querySelector(sel); }; }
  // Kerakli bosqichlar ro'yxati (ko'rilmaganlari) - darhol «ko'rildi» deb belgilanadi
  function fyKerakli(fan, turlar) {
    var kerak = turlar.filter(function (t) { return t && fyKerak(fan, t); });
    kerak.forEach(function (t) { fyQoy(fan, t); });
    return kerak;
  }

  /* Yo'riqnomani ochadi. O'yin «to'xtatildi» belgisini darhol oladi (oy.yoriq = true); boshqa yo'riqnoma hali ochiq bo'lsa
     (masalan, bosh sahifa yo'riqnomasining oxirgi qadami shu darsni ochgan bo'lsa) u yopilishini kutadi. */
  function fyOch(oy, ekran, kim, rasm, qadamlar, tugash) {
    if (!oy || !qadamlar.length) { return; }
    oy.yoriq = true;
    var k = 0;
    var tamom = function () { if (oy.yoriq) { oy.yoriq = false; if (tugash) { try { tugash(); } catch (e) {} } } };
    (function och() {
      if (oy.yoriq !== true) { return; }
      if ($(ekran).classList.contains("hidden")) { tamom(); return; }
      if (yq) { if (k++ < 30) { setTimeout(och, 100); } else { tamom(); } return; }
      yqOch(qadamlar, { kim: kim, rasm: rasm, ekran: ekran, tugash: tamom });
    })();
  }

  /* ---------- Sehrgarlik tarixi (Professor Binns): birinchi savol ustida ---------- */
  function fyTarix(majbur) {
    if (!tr || tr.bell || tr.rek || tr.lock || tr.yoriq) { return; }
    if (!majbur && !fyKerakli("tarix", ["asos"]).length) { return; }
    var x = fyX();
    fyOch(tr, "scr-tarix", x.binns, IMG_DIR + "binns/maslahat.webp", [
      { el: fyEl("#tr-prog"), m: x.tr1 },
      { el: fyEl("#scr-tarix .tr-karta"), m: x.tr2 },
      { el: fyEl("#tr-opts"), m: x.tr3, tap: true },
      { el: fyEl("#tr-opts"), m: x.tr4 }
    ]);
  }

  /* ---------- Afsunlar (Professor Flitvik): 1-24 o'rganish, 25-36 vaziyat, 37-48 ketma-ket ---------- */
  function fyAfNuqta() {
    var r = $("af-canvas").getBoundingClientRect(), p = af && af.pts && af.pts[0];
    return p ? [r.left + p[0] - 4, r.top + p[1] - 2] : null;
  }
  function fyAfsun(majbur) {
    if (!af || af.bell || af.rek || af.yoriq) { return; }
    var tur = af.mode === "vaz" ? "vaz" : af.mode === "zan" ? "zan" : "asos";
    if (majbur) { fyQoy("afsun", tur); } else if (!fyKerakli("afsun", [tur]).length) { return; }
    var x = fyX(), q = [], chiz = function (m) { return { el: fyEl("#scr-afsun .af-box"), m: m, kut: "afsun", b: x.chiz, nuqta: fyAfNuqta }; };
    var nom = function (id) { return (AF[id][lang] || AF[id].uz)[0]; };
    if (tur === "asos") {
      q = [{ el: fyEl("#scr-afsun .dr-head"), m: x.af1(nom(af.id)) },
           { el: fyEl("#scr-afsun .af-box"), m: x.af2 },
           { el: fyEl("#af-step"), m: x.af3 },
           { el: fyEl("#af-sham"), m: x.af4 },
           chiz(x.af5),
           { el: fyEl("#scr-afsun .af-fl"), m: x.af6 }];
    } else if (tur === "vaz") {
      var togri = af.id;
      q = [{ el: fyEl("#scr-afsun .dr-head"), m: x.vz1 },
           { el: fyEl("#af-opts"), m: x.vz2 },
           { el: function () { return [].slice.call($("af-opts").children).filter(function (b) { return b.textContent === nom(togri); })[0] || null; }, m: x.vz3(nom(togri)), tap: true },
           chiz(x.vz4)];
    } else {
      q = [{ el: fyEl("#scr-afsun .dr-head"), m: x.zn1 },
           { el: fyEl("#af-sham"), m: x.zn2 },
           chiz(x.zn3)];
    }
    fyOch(af, "scr-afsun", drX().afFlN, afFlImg("maslahat"), q);
  }

  /* ---------- Damlamalar (Professor Sneyp): retsept -> pishirish; 25-darsdan imtihon ---------- */
  function fyIksir(majbur) {
    if (!ik || ik.bell || ik.rek || ik.yoriq || ik.phase !== "rec") { return; }
    var tur = ik.bq.yop ? "imt" : "asos";
    if (majbur) { fyQoy("iksir", tur); } else if (!fyKerakli("iksir", [tur]).length) { return; }
    var x = fyX(), q, me = ik, bir = IK[ik.id].r[0];
    if (tur === "asos") {
      q = [{ el: fyEl("#ik-rec-l"), m: x.ik1 },
           { el: fyEl("#ik-slots"), m: x.ik2 },
           { el: fyEl("#ik-go"), m: x.ik3, tap: true },
           { el: fyEl("#ik-chips"), m: x.ik4 },
           { el: fyEl("#ik-sham"), m: x.ik5 },
           { el: fyEl("#ik-prog"), m: x.ik6(ik.bq.xato) },
           { el: function () { return ik === me ? $("ik-chips").children[ik.chips.indexOf(bir)] || null : null; }, m: x.ik7(ikNom(bir)), tap: true }];
    } else {
      q = [{ el: fyEl("#ik-rec-l"), m: x.im1 },
           { el: fyEl("#ik-go"), m: x.im2 }];
    }
    fyOch(ik, "scr-iksir", drX().ikSnN, ikSnImg("maslahat"), q, function () { if (ik === me && ik.t0) { ik.t0 = Date.now(); } });
  }

  /* ---------- Qora kuchlardan himoya (Professor Lyupin): birinchi xavf ustida ---------- */
  function fyHimoya() {
    if (!hm || hm.bell || hm.rek || hm.yoriq || !fyKerakli("himoya", ["asos"]).length) { return; }
    var x = fyX(), me = hm, id = hm.waves[hm.i], af0 = hmAf(HM[id].s);
    fyOch(hm, "scr-himoya", drX().hmLpN, hmLpImg("maslahat"), [
      { el: fyEl("#hm-box"), m: x.hm1 },
      { el: fyEl("#scr-himoya .dr-head"), m: x.hm2(hmTx(id)[0]) },
      { el: fyEl("#hm-sham"), m: x.hm3 },
      { el: fyEl("#hm-lives"), m: x.hm4 },
      { el: function () { return [].slice.call($("hm-opts").children).filter(function (b) { return b.textContent === af0; })[0] || null; }, m: x.hm5(hmTx(id)[0], af0), tap: true }
    ], function () { if (hm === me && !hm.lock) { hm.t0 = Date.now(); } });
  }

  /* ---------- Uchish (Xuch xonim): supurgi to'xtab turadi, lekin boshqarsa bo'ladi; 4-darsdan bladjer, 7-darsdan Snitch ---------- */
  function fyUchish() {
    if (!uch || uch.bell || uch.rek || uch.yoriq) { return; }
    var tur = fyKerakli("uchish", ["asos", uch.n >= 4 ? "bld" : "", uch.n >= 7 ? "sn" : ""]);
    if (!tur.length) { return; }
    var x = fyX(), q = [], maydon = fyEl("#scr-uchish .uc-box");
    if (tur.indexOf("asos") >= 0) { q.push({ el: maydon, m: x.uc1 }, { el: maydon, m: x.uc2 }, { el: fyEl("#uc-step"), m: x.uc3 }); }
    if (tur.indexOf("bld") >= 0) { q.push({ el: maydon, m: x.uc4 }, { el: fyEl("#uc-lives"), m: x.uc5 }); }
    if (tur.indexOf("sn") >= 0) { q.push({ el: maydon, m: x.uc6 }); }
    q.push({ el: maydon, m: x.uc7, kut: "uchish", b: x.ucB });
    fyOch(uch, "scr-uchish", drX().ucXcN, uchXcImg("maslahat"), q);
  }

  /* ---------- Sehrli maxluqlar (Xagrid): kartalar ochiq turganda bitta juftlik ko'rsatiladi, keyin o'quvchi o'zi topadi ---------- */
  function fyMaxluq(bosh) {
    if (!mx || mx.bell || mx.rek || mx.yoriq) { return false; }
    var tur = mx.peek > 0 ? "asos" : "kor";
    if (!fyKerakli("maxluq", [tur]).length) { return false; }
    var x = fyX(), me = mx, q;
    var k = mx.yangi[0] || mx.cards[0].k, ia = -1, ib = -1;
    mx.cards.forEach(function (c, i) { if (c.k === k) { if (c.f) { ib = i; } else { ia = i; } } });
    var karta = function (i) { return function () { return mx === me && mx.cards[i] ? mx.cards[i].el : null; }; };
    var yop = function () { if (mx === me && !mx.boshlandi && bosh) { bosh(); } };
    if (tur === "asos") {
      q = [{ el: fyEl("#mx-grid"), m: x.mx1 },
           { el: karta(ia), m: x.mx2(mxTx(k)[0]) },
           { el: karta(ib), m: x.mx3(mxTx(k)[1]) },
           { el: fyEl("#mx-sham"), m: x.mx4 },
           { el: karta(ia), m: x.mx5(mxTx(k)[0]), tap: true, on: yop },
           { el: karta(ib), m: x.mx6, tap: true }];
    } else {
      q = [{ el: fyEl("#mx-grid"), m: x.mk1 }, { el: fyEl("#mx-grid"), m: x.mk2 }];
    }
    fyOch(mx, "scr-maxluq", drX().mxXgN, mxXgImg("maslahat"), q, function () { yop(); if (mx === me) { mx.t0 = Date.now(); } });
    return tur === "asos";
  }

  /* ---------- Astronomiya (Professor Sinistra): birinchi savol ustida; 13-darsdan ko'zgudagi aks, 25-darsdan siljigan yulduz ---------- */
  function fyAstro() {
    if (!yl || yl.bell || yl.rek || yl.yoriq) { return; }
    var tur = fyKerakli("astro", ["asos", yl.n >= 13 ? "aks" : "", yl.n >= 25 ? "sil" : ""]);
    if (!tur.length) { return; }
    var x = fyX(), me = yl, sv = yl.savol[yl.i], q = [];
    var variant = function (f) { return function () { var j = -1; sv.opts.forEach(function (o, i) { if (j < 0 && f(o)) { j = i; } }); return yl === me && j >= 0 ? $("yl-opts").children[j] || null : null; }; };
    var bor = function (tz) { return sv.opts.some(function (o) { return o.tz === tz; }); };
    if (tur.indexOf("asos") >= 0) { q.push({ el: fyEl("#yl-ref"), m: x.yl1(ylTx(sv.id)[0]) }, { el: fyEl("#yl-opts"), m: x.yl2 }, { el: fyEl("#yl-sham"), m: x.yl3 }); }
    if (tur.indexOf("aks") >= 0) { q.push(bor("aks") ? { el: variant(function (o) { return o.tz === "aks"; }), m: x.yl4 } : { el: fyEl("#yl-opts"), m: x.yl4b }); }
    if (tur.indexOf("sil") >= 0 && bor("sil")) { q.push({ el: variant(function (o) { return o.tz === "sil"; }), m: x.yl5 }); }
    q.push({ el: variant(function (o) { return o.ok; }), m: x.yl6, tap: true });
    fyOch(yl, "scr-astro", drX().ylSnN, ylSnImg("maslahat"), q, function () { if (yl === me && !yl.lock) { yl.t0 = Date.now(); } });
  }

  /* ---------- O'simlikshunoslik (Professor Sprout): birinchi ehtiyoj chiqqanda; 5/13-darsda yangi asbob, 9-darsdan 6 tuvak ---------- */
  function fyOsimlik(pi) {
    if (!os || os.bell || os.rek || os.yoriq) { return; }
    var tur = fyKerakli("osimlik", ["asos", os.n >= 5 ? "as3" : "", os.n >= 9 ? "t6" : "", os.n >= 13 ? "as4" : ""]);
    if (!tur.length) { return; }
    var x = fyX(), dx = drX(), me = os, pot = os.pots[pi], a = pot.need, q = [];
    var asbob = function (k) { return function () { return os === me ? $("os-tools").children[k] || null : null; }; };
    if (tur.indexOf("asos") >= 0) {
      q.push({ el: fyEl("#os-grid"), m: x.os1 },
             { el: function () { return os === me ? pot.el : null; }, m: x.os2(dx.osAs[a]) },
             { el: asbob(a), m: x.os3(dx.osAs[a]), tap: true },
             { el: function () { return os === me ? pot.el : null; }, m: x.os4, tap: true },
             { el: fyEl("#os-lives"), m: x.os5 });
    }
    if (tur.indexOf("as3") >= 0) { q.push({ el: asbob(2), m: x.os6(dx.osAs[2]) }); }
    if (tur.indexOf("t6") >= 0) { q.push({ el: fyEl("#os-grid"), m: x.os7 }); }
    if (tur.indexOf("as4") >= 0) { q.push({ el: asbob(3), m: x.os6(dx.osAs[3]) }); }
    q.push({ el: fyEl("#os-grid"), m: x.os8 });
    fyOch(os, "scr-osimlik", dx.osSpN, osSpImg("maslahat"), q);
  }

  // «Qanday bajariladi?» havolalari: shu fanning yo'riqnomasini qaytadan ko'rsatadi
  function fyQandayInit() {
    var x = fyX();
    [["tr-qanday", function () { fyTarix(true); }],
     ["af-qanday", function () { if (af && !af.bell && !af.rek) { var n = af.n; fyOchir("afsun"); afOpen(false, n); } }],
     ["ik-qanday", function () { if (ik && !ik.bell && !ik.rek) { var n = ik.n; fyOchir("iksir"); ikOpen(false, n); } }],
     ["hm-qanday", function () { if (hm) { fyOchir("himoya"); hmGo(); } }],
     ["uc-qanday", function () { if (uch) { fyOchir("uchish"); uchGo(); } }],
     ["mx-qanday", function () { if (mx) { fyOchir("maxluq"); mxGo(); } }],
     ["yl-qanday", function () { if (yl) { fyOchir("astro"); ylGo(); } }],
     ["os-qanday", function () { if (os) { fyOchir("osimlik"); osGo(); } }]].forEach(function (p) {
      var b = $(p[0]);
      if (b) { b.textContent = x.qanday; b.addEventListener("click", p[1]); }
    });
  }
  try { fyQandayInit(); } catch (e) {}
