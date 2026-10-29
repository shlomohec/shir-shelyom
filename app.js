/* שיר של יום בחול המועד — לוגיקה זהה לגרסת הקובץ */
const source = 'https://www.daat.ac.il/encyclopedia/images/shirshelyom.pdf';
const hebrew = new Intl.DateTimeFormat('en-u-ca-hebrew', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
const weekdayNames = ['יום ראשון','יום שני','יום שלישי','יום רביעי','יום חמישי','יום שישי','שבת'];
const hebrewMonths = {Tishri:'תשרי', Heshvan:'חשון', Kislev:'כסלו', Tevet:'טבת', Shevat:'שבט', Adar:'אדר', 'Adar I':'אדר א׳', 'Adar II':'אדר ב׳', Nisan:'ניסן', Iyar:'אייר', Sivan:'סיון', Tamuz:'תמוז', Av:'אב', Elul:'אלול'};
const numerals = ['','א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ז׳','ח׳','ט׳','י׳','י״א','י״ב','י״ג','י״ד','ט״ו','ט״ז','י״ז','י״ח','י״ט','כ׳','כ״א','כ״ב','כ״ג','כ״ד','כ״ה','כ״ו','כ״ז','כ״ח','כ״ט','ל׳'];
function gimFull(n){ const h=['','ק','ר','ש','ת','תק','תר','תש','תת','תתק']; const t=['','י','כ','ל','מ','נ','ס','ע','פ','צ']; const u=['','א','ב','ג','ד','ה','ו','ז','ח','ט'];
  let r=''; if(n>=100){ r=h[Math.floor(n/100)]; n%=100; }
  if(n===15) return r+'טו'; if(n===16) return r+'טז';
  const base=t[Math.floor(n/10)]+u[n%10]; if(!base) return r;
  return r+(base.length>1 ? base.slice(0,-1)+'\u05F4'+base.slice(-1) : base+'\u05F3'); }
function hebrewYear(y){ return 'ה\u05F3'+gimFull(y-5000).replace(/\u05F3$/,'').replace(/([^\u05F4\u05F3])([א-ת])$/, (m,a,b)=>a+'\u05F4'+b); }
const psalms = {
  '114': {number:'קי״ד',title:'בצאת ישראל ממצרים'}, '78':{number:'ע״ח',title:'משכיל לאסף האזינה'},
  '80':{number:'פ׳',title:'למנצח אל שושנים'}, '105':{number:'ק״ה',title:'הודו לה׳ קראו בשמו'},
  '135':{number:'קל״ה',title:'הללויה הללו את שם ה׳'}, '66':{number:'ס״ו',title:'למנצח שיר מזמור'},
  '29':{number:'כ״ט',title:'מזמור לדוד הבו לה׳'}, '50':{number:'נ׳',title:'מזמור לאסף אל אלהים ה׳'},
  '94b':{number:'צ״ד, ט״ז-כ״ג',title:'מי יקום לי'}, '94a':{number:'צ״ד, א׳-ט״ו',title:'אל נקמות ה׳'},
  '81':{number:'פ״א',title:'למנצח על הגיתית'}, '82':{number:'פ״ב',title:'מזמור לאסף אלהים ניצב'},
  '76':{number:'ע״ו',title:'למנצח בנגינות מזמור לאסף'}, '42':{number:'מ״ב',title:'למנצח משכיל לבני קורח'},
  '12':{number:'י״ב',title:'למנצח על השמינית'}, '8':{number:'ח׳',title:'למנצח על הגיתית'},
  '18':{number:'י״ח',title:'למנצח לעבד ה׳'}, '136':{number:'קל״ו',title:'הודו לה׳ כי טוב'},
  '24':{number:'כ״ד',title:'לדוד מזמור לה׳ הארץ ומלואה'}, '48':{number:'מ״ח',title:'שיר מזמור לבני קורח גדול ה׳ ומהולל'},
  '94':{number:'צ״ד',title:'אל נקמות ה׳'}, '93':{number:'צ״ג',title:'ה׳ מלך גאות לבש'},
  '19':{number:'י״ט',title:'למנצח השמים מספרים'}, '68':{number:'ס״ח',title:'למנצח לדוד מזמור שיר'},
  '104':{number:'ק״ד',title:'ברכי נפשי'}, '32':{number:'ל״ב',title:'למנצח אשרי נשוי פשע'},
  '30':{number:'ל׳',title:'מזמור שיר חנוכת הבית'}, '22':{number:'כ״ב',title:'למנצח על אילת השחר'},
};
function choose(day, week, map){ return map[day] ? map[day][week] : undefined; }
function answer(date, diaspora = false){
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const dateObj = new Date(date+'T12:00:00+03:00');
  if (Number.isNaN(dateObj.getTime()) || dateObj.toISOString().slice(0,10)!==date) return null;
  const parts = Object.fromEntries(hebrew.formatToParts(dateObj).filter(p=>['day','month','year','weekday'].includes(p.type)).map(p=>[p.type,p.value]));
  const n=Number(parts.day), month=parts.month, week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(parts.weekday);
  if (!n || week<0) return null;
  const y=Number(parts.year);
  const dateLabel=`${weekdayNames[week]}, ${numerals[n]||n} ב${hebrewMonths[month]||month} ${hebrewYear(y)}`;
  const out=(psalm, explanation, greeting)=>({day:dateLabel,psalm,greeting,explanation});
  if (week===6) return out(undefined,'בשבת אין הצגת פרק.','שבת שלום!');
  if (month==='Tishri' && [1,2].includes(n)) return out('81','ראש השנה · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Tishri' && n===10) return out('32','יום כיפור · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Tishri' && n===15) return out('76','יום ראשון של סוכות · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Tishri' && n===16 && diaspora) return out('42','יום טוב שני של סוכות בחו״ל · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Tishri' && n===22) return out('12','שמיני עצרת · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Tishri' && n===23 && diaspora) return out(week===0?'12':'8','שמחת תורה בחו״ל · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Nisan' && n===15) return out('114','יום ראשון של פסח · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Nisan' && n===16 && diaspora) return out('78','יום טוב שני של פסח בחו״ל · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Nisan' && n===21) return out('18','שביעי של פסח · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Nisan' && n===22 && diaspora) return out(week===0?'18':'136','אחרון של פסח בחו״ל · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Sivan' && n===6) return out('19','שבועות · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (month==='Sivan' && n===7 && diaspora) return out('68','יום טוב שני של שבועות בחו״ל · מספר הפרק לפי הטבלה.','א גוט יום טוב');
  if (n===1 || n===30) return out('104','ראש חודש דוחה כל שיר אחר לפי הטבלה.');
  if (month==='Nisan' && n>=16 && n<=20) {
    const k=n-15;
    const map={
      1:{0:'114',1:'78',3:'78',5:'78'},
      2:{1:'78',2:'80',4:'80'},
      3:{0:'80',2:'80',3:'105',5:'105'},
      4:{1:'105',3:'105',4:'135'},
      5:{0:'135',2:'135',4:'135',5:'66'}
    };
    return out(choose(k,week,map),`פסח · ${numerals[k]} חול המועד · ${weekdayNames[week]}.`);
  }
  if (month==='Tishri' && n>=16 && n<=21) {
    const k=n-15;
    const map={
      1:{0:'29',2:'29',3:'29',5:'29'},
      2:{1:'50',3:'50',4:'50'},
      3:{0:'50',2:'94b',4:'94b',5:'94b'},
      4:{1:'94b',3:'94a',5:'94a'},
      5:{0:'94a',2:'94a',4:'81'},
      6:{0:'81',1:'81',3:'81',5:'82'}
    };
    return out(choose(k,week,map),`סוכות · ${k===6?'הושענא רבה':numerals[k]+' חול המועד'} · ${weekdayNames[week]}.`);
  }
  if (month==='Kislev' || month==='Tevet') {
    for(let offset=0;offset<8;offset++) {
      const prior=new Date(dateObj); prior.setUTCDate(prior.getUTCDate()-offset);
      const p=Object.fromEntries(hebrew.formatToParts(prior).filter(q=>['day','month'].includes(q.type)).map(q=>[q.type,q.value]));
      if(p.month==='Kislev' && Number(p.day)===25) return out('30','חנוכה לפי הטבלה.');
    }
  }
  if ((month==='Adar' || month==='Adar II') && n===14) return out('22','פורים לפי הטבלה.');
  const ordinary=['24','48','82','94','81','93'];
  return out(ordinary[week],`יום חול רגיל · ${weekdayNames[week]}. לפי משנה תמיד ז׳:ד׳.`);
}
function shift(date,delta){ const d=new Date(date+'T12:00:00Z'); if(Number.isNaN(d.getTime())) return todayJerusalem(); d.setUTCDate(d.getUTCDate()+delta); return d.toISOString().slice(0,10); }
function todayJerusalem(){ const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(x=>['year','month','day'].includes(x.type)).map(x=>[x.type,x.value])); return `${p.year}-${p.month}-${p.day}`; }
if (typeof module!=='undefined') module.exports={answer,shift,todayJerusalem,psalms};

/* לוח שנה עברי — חישוב מלא, בלי תלות בתצוגה אזרחית */
function hLeap(y){ return ((7*y+1)%19)<7; }
function hElapsed(y){
  const m=235*Math.floor((y-1)/19)+12*((y-1)%19)+Math.floor((7*((y-1)%19)+1)/19);
  const pe=204+793*(m%1080);
  const he=5+12*m+793*Math.floor(m/1080)+Math.floor(pe/1080);
  const day=1+29*m+Math.floor(he/24);
  const parts=(he%24)*1080+pe%1080;
  let alt=day;
  if(parts>=19440||((day%7)===2&&parts>=9924&&!hLeap(y))||((day%7)===1&&parts>=16789&&hLeap(y-1))) alt=day+1;
  if(alt%7===0||alt%7===3||alt%7===5) alt++;
  return alt;
}
function hYearDays(y){ return hElapsed(y+1)-hElapsed(y); }
function hMonthNames(y){
  const leap=hLeap(y);
  return leap
    ? ['תשרי','חשון','כסלו','טבת','שבט','אדר א׳','אדר ב׳','ניסן','אייר','סיון','תמוז','אב','אלול']
    : ['תשרי','חשון','כסלו','טבת','שבט','אדר','ניסן','אייר','סיון','תמוז','אב','אלול'];
}
function hMonthLengths(y){
  const yd=hYearDays(y);
  const cheshvan=(yd%10===5)?30:29;
  const kislev=(yd%10===3)?29:30;
  const leap=hLeap(y);
  return leap
    ? [30,cheshvan,kislev,29,30,30,29,30,29,30,29,30,29]
    : [30,cheshvan,kislev,29,30,29,30,29,30,29,30,29];
}
/* המרה מתאריך עברי למחרוזת ISO פנימית (לא מוצגת למשתמש) */
function hebrewToISO(y,mIdx,d){
  const lens=hMonthLengths(y);
  if(mIdx<0||mIdx>=lens.length||d<1||d>lens[mIdx]) return null;
  let rd=-1373428+hElapsed(y)+d-1;
  for(let i=0;i<mIdx;i++) rd+=lens[i];
  return new Date(Date.UTC(2000,0,1)+(rd-730120)*86400000).toISOString().slice(0,10);
}
/* התאריך העברי של היום הנוכחי בלוח ישראל */
function todayHebrew(){
  const iso=todayJerusalem();
  const parts=Object.fromEntries(hebrew.formatToParts(new Date(iso+'T12:00:00+03:00')).filter(p=>['day','month','year'].includes(p.type)).map(p=>[p.type,p.value]));
  const y=Number(parts.year), d=Number(parts.day);
  const names=hMonthNames(y);
  const enName=parts.month; /* שם חודש באנגלית מ-Intl */
  const leapEn=['Tishri','Heshvan','Kislev','Tevet','Shevat','Adar I','Adar II','Nisan','Iyar','Sivan','Tamuz','Av','Elul'];
  const plainEn=['Tishri','Heshvan','Kislev','Tevet','Shevat','Adar','Nisan','Iyar','Sivan','Tamuz','Av','Elul'];
  const mIdx=(hLeap(y)?leapEn:plainEn).indexOf(enName);
  if(mIdx<0) return null;
  return {y,mIdx,d};
}
if (typeof module!=='undefined') Object.assign(module.exports,{hLeap,hMonthNames,hMonthLengths,hebrewToISO,todayHebrew,hYearDays});
