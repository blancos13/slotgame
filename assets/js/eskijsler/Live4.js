 var Live = {
     liveserver: '/ajax/ply.php',
     xmlserver: '/ajax/root_json.php',
     menuserver: '/ajax/root_liste.php',
     interval: null,
     refresh: 10 * 1000,
     oldscores: {},
     bets: {},
     country: {},
     countryhide: new Array(),
     countrycountbets: new Array(),
	 betsgameski : new Array(),
     livedata: {},
	 maingamearrow: {},
     livefavs: {},
     cks: 0,
     maxliveodd: 0,
     basketball:"1",
     prematch:"1",
     diff: 0,
     lang:"en",
     csb:"com",
     utc:0,
     lm: 90,
     serverdate: '0000-00-00 00:00:00',
     stamp: 0,
     spids: {
         4: {
             'spidid': 1,
             'spidname': 'FUTBOL',
             'active': '1'
         },
         7: {
             'spidid': 5,
             'spidname': 'BASKETBOL',
             'active': '1'
         },
         18: {
             'spidid': 6,
             'spidname': 'VOLEYBOL',
             'active': '1'
         },
         5: {
             'spidid': 7,
             'spidname': 'TENİS',
             'active': '1'
         },
         8: {
             'spidid': 8,
             'spidname': 'BUZ HOKEYİ',
             'active': '1'
         }


     },
     orktr: 0,
     cborktr: 0,
     agames: {},
     idcol: {},
     tvip: '',
     Play: function() {
	Live.GetJson();
          },
     adfavs: function(cv) {
         Live.livefavs[cv]=1;
	 $('#stars_'+cv).fadeOut();
	 document.getElementById("stars_"+cv).src="/resources/themes/common/icons/16/star_2.png";
	 $('#stars_'+cv).fadeIn();
	 if(Live.Details.data)
	 {
	 Live.Details.JsonParser(Live.Details.data);
	 }
     },
     remfavs: function(cv) {
         Live.livefavs[cv]=false;
	 $('#stars_'+cv).fadeOut();
	 document.getElementById("stars_"+cv).src="/resources/themes/common/icons/16/star_4.png";
	 $('#stars_'+cv).fadeIn();
	 if(Live.Details.data)
	 {
	 Live.Details.JsonParser(Live.Details.data);
	 }
     },
     homeawaychange: function(h,a,o) {
        o = o.replace(h,'Evsahibi ');
        o = o.replace(a,'Deplasman ');
        o = o.replace('  (Women) ',' ');
	return o;
     },
     HideCountry: function() {
         for (var v in Live.countryhide) {
             $('#livecountryid_' + v).hide();
             $('#livecountrybetscount_' + v).text('(' + Live.countrycountbets[v] + ')').show();
             $('#livecountrytoogleclass_' + v).addClass("CountryOpenIcon");
         }
     },
	 
	 ClosedDetail: function(liveid) {
			 $('#macdetaykapat' + liveid).hide();
			 $('#macdetayac' + liveid).show();
             $('#details_' + liveid).html('');
     },
	 
     ToggleCountry: function(divid) {
         if (Live.countryhide[divid]) {
             delete Live.countryhide[divid];
             $('#livecountryid_' + divid).show();
             $('#livecountrybetscount_' + divid).hide();
             $('#livecountrytoogleclass_' + divid).removeClass("CountryOpenIcon");
         } else {
             $('#livecountryid_' + divid).hide();
             $('#livecountrybetscount_' + divid).text('(' + Live.countrycountbets[divid] + ')').show();
             Live.countryhide[divid] = divid;
             $('#livecountrytoogleclass_' + divid).addClass("CountryOpenIcon");
         }
     },
     GetJson: function() {
	$.ajax({
          type: "GET",
          url: Live.menuserver + '?&cmd=main&csb='+Live.csb+'&lang='+Live.lang+'&zfz=' + new Date().getTime(),
          dataType: "json",
          timeout: 15000,
          success: function(data) {
               Live.Parser(data);
               Live.interval = window.setTimeout(Live.GetJson, 25 * 1000);
           },
          error: function(xhr, ajaxOptions, thrownError) {
              if (xhr.statusText == "OK") {
                   Live.interval = window.setTimeout(Live.GetJson, 30 * 1000);
               } else {
                  Live.interval = window.setTimeout(Live.GetJson, 15 * 1000);
     }
     }
     });
     },
     GetToken: function() {
         $.ajax({
             type: "GET",
             url: Live.xmlserver + '?&cmd=token&csb='+Live.csb+'&lang='+Live.lang+'&zfz=' + new Date().getTime(),
             dataType: "json",
             timeout: 10000,
             success: function(data) {
             }
         });
     },
     Stop: function() {
         clearInterval(Live.interval);
         Live.livedata = {};
     },
     Parser: function(data) {
     $betsgam = {};
     $betsgameski = {};
     $boyunlar = {};
	 
	 $bets = {};
     $country = {};
	 $countrys={};
	 $countrys[4]={};
	 $countrys[7]={};
	 $countrys[5]={};
	 $countrys[18]={};
	 $countrys[56]={};
	 $aktifler={};
	 $aktifler[4]=1;
	 $aktifler[18]=1;
	 $aktifler[5]=1;
	 $aktifler[56]=1;
	 $aktifler[7]=Live.basketball;
         if (data) {
	 var json = data;
         $.each(json, function(k, p) {
		 if (Live.spids[p.spid] && Live.spids[p.spid].active==1) {
         var eid = parseInt(p.id);
         var hteam = p.h;
         var ateam = p.a;
         var team = p.tkm;
         var egamesd = p.live;
         var league = p.lname;
         var country = p.uname;
		 var farksayisi_ver = p.farksayisi;
         var reftimeutc = p.stps;
         var countrycode = p.uname.toLowerCase();
         var countryid = parseInt(p.uid);
         var startdate = parseInt(p.stps);
         var datemk = p.tarih;
         var timemk = (parseInt(p.stps)*1000);
	 var radarid = p.radarid;
	 var matchsimulation = p.smid;
	 var leagueid = p.lid;
	 var sht = p.sht;
	 var red1team = 0;
	 var red2team = 0;
	 var status = 1;
	 var spid =parseInt(p.spid);
	 var tvid = p.tv;
	 var pid = parseInt(p.pid ? p.pid:'0');                
         $bets[eid] = {
		     eid:eid,
                     status: status,
                     pid: (p.pid ? p.pid:'0'),
                     team: team,
                     hteam: hteam,
                     ateam: ateam,
                     timemk: timemk,
                     league: league,
                     sht: sht,
					 farklasayisi: farksayisi_ver,
		     red1t:red1team,
		     red2t:red2team,
                     country: country,
		     diftext:sht,
                     countryid: countryid,
                     radarid: radarid,
                     startdate: startdate,
		     datemk:datemk,
                     spid: p.spid,
                     diff: (p.dk ? p.dk:'0'),
                     sch: (p.sch ? p.sch:'0'),
                     sca: (p.sca ? p.sca:'0'),
                     isch: (p.isch ? p.isch:'0'),
                     isca: (p.isca ? p.isca:'0'),
                     ph: p.periodsh,
                     pa: p.periodsa,
		     periodtext:Live.GetPeriyod(spid, pid),
                     startdate: startdate,
                     running: p.run,
                     vc: p.tv,
                     videoid: p.tv,
                     matchsimulation: matchsimulation,
                     games: {}
                 };
		 if (Live.livedata[eid]) {
                     $bets[eid].status = Live.livedata[eid].status;
                 }
                 if (!$countrys[spid][countryid]) {
                     $countrys[spid][countryid] = {
                         countryname: country,
                         bets: {}
                     };
                 }
                 $countrys[spid][countryid].bets[eid] = eid;
		 if(p.pid>0)
		 {
          	 $bets[eid].sch = p.sch;
                 $bets[eid].sca = p.sca;
                 }
				 
				  $oyunlars = {};
	 $boyunlar[eid] = {};
	 $betsgameski[eid] = {};
 	 if (typeof p.live != 'undefined') {
 	 $.each(p.live, function(y, r) {
	 var gid = parseInt(r.tempid);
	 if (Live.agames[gid]) {
                             var bgid = parseInt(r.id);
                             var oyunad = r.N;
                             var statu = r.o;
							 var showlines = r.showl;
                             var colum = r.games.length;
                             var oranlar = {};
                             var count = 0;
                                 $.each(r.games, function(kk, odds) {
                                     brid = parseInt(odds.Id);
                                     oran = parseFloat(odds.Odds).toFixed(2);
                                     ostatu = odds.Visible;
                                     tercih = odds.Name;
                                     tercihs = (odds.Name1x2 ? odds.Name1x2:odds.Name);
                                     if (ostatu) {
                                         oranlar[brid] = {
                                             brid: brid,
					     image: Live.Details.OddsArrows(eid,Live.agames[gid], brid,Live.OddsFixed(oran)),
                                             oran: Live.GetFixedrates(p.spid,oran),
                                             tercih: tercih,
                                             tercihs: tercihs,
                                             statu: ostatu
                                         };
                                         count++;
                                     }
                                 });
				if (!Live.Details.golbet[Live.agames[gid]]) {
                                 $oyunlars[Live.agames[gid]] = {
                                     bgid: bgid,
                                     gid: Live.agames[gid],
                                     oyunad: oyunad,
                                     statu: statu,
                                     colum: colum,
                                     count: count,
                                     oranlar: oranlar,
                                     showlines: showlines
                                 };
                             }
if($bets[eid])
{
Live.maingamearrow[eid]=$oyunlars;
$betsgameski[eid] = $oyunlars;
$betsgam[eid] = $oyunlars;
$bets[eid].games=$oyunlars;
}
}
});
}


             }
         });
		 Live.betgame=$betsgam;
         Live.bets = $bets;
	 if(Live.basketball=="2")
	 {
	 $countrys[7]={};
	 }
         Live.country = $countrys;
         Live.GetLiveData();
	}
     },
	 
	 GetFixedrates: function(spid,rate) {
	if(spid==4)
	{
	rate = Live.OddsFixed(rate);
	}else if(spid==7)
	{
	rate = Live.OddsFixedcb(rate);
	}else{
	rate = Live.OddsFixedcbd(rate);
	}



     return rate;
     },
	 
     GetLiveData: function() {
         if (typeof Live.bets != 'undefined') {
             var rquery = '';
             for (var i in Live.bets) {
                 rquery += i + ',';
             }
             rquery = rquery.substring(0, (rquery.length - 1));
             var params = {
                 liveids: rquery,
                 cks: Live.cks,
                 parnt: '10831',
                 token: '82228824f5f57374559ed8fc69015733',
                 cmd: 'getlivedata'
             };
             $.post(Live.liveserver, params, function(json) {
                 if (json.success) {
                     jQuery.each(json.results, function(k, n) {
			 if(Live.bets[n.liveid])
			 {
                         Live.livedata[n.liveid] = {status: n.aktif};
                         Live.bets[n.liveid].status = n.aktif;
	 		 }
                     });
                     Live.Render();
                 } else {
                     if (json.messages == 'CKS') {
                         Live.Stop();
                     }
                     $('#cbetnum').html('0');
                     $('#liveEventsRight').empty().html('<div class="kupon-bos" style="background-color:#FEC337"><div class="kupon-bos-text">Canlı Bahis Bulunmuyor</div></div>');
                 }
             }, 'json');
         }
     },
     FixTo: function(t) {
         return t.toString().length < 2 ? '0' + t : t;
     },
     FixDate: function(date) {
         var date = Lib.Utils.Date.ParseDataDate(date);
         date.setHours(date.getHours() + Live.diff);
         return date;
     },
     FixHours: function(date) {
         var date = new Date(date);
         date.setHours(date.getHours());
         return Live.FixTo(date.getHours()) + ':' + Live.FixTo(date.getMinutes());
     },
     FixTime: function(diff) {
    var minute = Live.FixTo(parseInt(Live.utc + diff / 60));
    return minute + '.dk';
},
     FixMinute: function(diff) {
         var minute = Live.FixTo(parseInt(diff / 60));
         return minute;
     },
     Difference: function(a, b, c, d) {
    var add = 0;
    if (c > 0) {
        add = c;
    }
    if (!b) return add;
    return ServerTime.GetUnixTimeStamp() - Math.round(d / 1000) + add;
},
     GetPeriyod: function(spid, pid) {
         var periyodname = "";
         switch (spid) {
             case 4:
                 switch (pid) {
                     case 0:
                         periyodname = 'Başlamadı';
                         break;
                     case 1:
                         periyodname = '1.Devre';
                         break;
                     case 2:
                         periyodname = 'Devre Arası';
                         break;
                     case 3:
                         periyodname = '2.Devre';
                         break;
                     case 4:
                         periyodname = 'Uzatmaya Gitti';
                         break;
                     case 5:
                         periyodname = '1.Uzatmalar';
                         break;
                     case 6:
                         periyodname = 'Uzatma Arası';
                         break;
                     case 7:
                         periyodname = '2.Uzatmalar';
                         break;
                     case 8:
                         periyodname = 'Uzatmalar Bitti';
                         break;
                     case 9:
                         periyodname = 'Penaltılar';
                         break;
                     case 255:
                         periyodname = 'Bitti';
                         break;
                     case 256:
                         periyodname = 'Yarıda Kaldı';
                         break;
                     default:
                         periyodname = 'Error';
                 }
                 break;
		case 7:
                 switch (pid) {
                     case 0:
                         periyodname = 'Başlamadı';
                         break;
                     case 1:
                         periyodname = '1.Çeyrek';
                         break;
                     case 2:
                         periyodname = '1. Duraklama';
                         break;
                     case 3:
                         periyodname = '2.Çeyrek';
                         break;
                     case 4:
                         periyodname = '2. Duraklama';
                         break;
                     case 5:
                         periyodname = '3.Çeyrek';
                         break;
                     case 6:
                         periyodname = '3. Duraklama';
                         break;
                     case 7:
                         periyodname = '4.Çeyrek';
                         break;
                     case 8:
                         periyodname = 'Duraklama';
                         break;
                     case 9:
                         periyodname = 'STP';
                         break;
                     case 10:
                         periyodname = 'UZTM';
                         break;
                     case 11:
                         periyodname = 'STP';
                         break;
                     case 255:
                         periyodname = 'Bitti';
                         break;
                     default:
                         periyodname = 'Error';
                 }
                 break;
		case 56:
                 switch (pid) {
                     case 0:
                         periyodname = 'Başlamadı';
                         break;
                     case 1:
                         periyodname = '1.SET';
                         break;
                     case 2:
                         periyodname = '1.STP';
                         break;
                     case 3:
                         periyodname = '2.SET';
                         break;
                     case 4:
                         periyodname = '2.STP';
                         break;
                     case 5:
                         periyodname = '3.SET';
                         break;
                     case 6:
                         periyodname = '3.STP';
                         break;
                     case 7:
                         periyodname = '4.SET';
                         break;
                     case 8:
                         periyodname = '4.STP';
                         break;
                     case 9:
                         periyodname = '5.SET';
                         break;
                     case 10:
                         periyodname = '5.STP';
                         break;
                     case 11:
                         periyodname = '6.SET';
                         break;
                     case 12:
                         periyodname = '6.STP';
                         break;
                     case 13:
                         periyodname = '7.SET';
                         break;
                     case 14:
                         periyodname = '7.STP';
                         break;
                     case 255:
                         periyodname = 'Bitti';
                         break;
                     default:
                         periyodname = 'Error';
                 }
                 break;
		case 5:
                 switch (pid) {
                     case 0:
                         periyodname = 'Başlamadı';
                         break;
                     case 1:
                         periyodname = '1.SET';
                         break;
                     case 2:
                         periyodname = '2.SET';
                         break;
                     case 3:
                         periyodname = '3.SET';
                         break;
                     case 4:
                         periyodname = '4.SET';
                         break;
                     case 5:
                         periyodname = '5.SET';
                         break;
                     case 255:
                         periyodname = 'Bitti';
                         break;
                     default:
                         periyodname = 'Error';
                 }
                 break;

         }
         return periyodname;
     },
     CheckGoal: function() {
         var textAnimationDuration = 3000;
         jQuery.each(Live.bets, function(k, v) {
	     if(v.spid=="4")
	     {
             if (Live.oldscores[k]) {
                 if (v.sch != Live.oldscores[k].sch || v.sca != Live.oldscores[k].sca) {
                     var eventRowSelector = '#liveEvent_' + k;
                     delay = textAnimationDuration;
                     var oldc = $(eventRowSelector).html();
                     Live.AnimateText($(eventRowSelector), 'GOOOL', delay);
                     window.setTimeout(function() {
                         $(eventRowSelector).removeClass('AnimationContainer').html(oldc);
                     }, 3000);
                 }
             }
		}
             Live.oldscores[k] = {
                 sch: v.sch,
                 sca: v.sca
             };
         });
     },
     AnimateText: function(container, text, duration) {
         var stepDuration = duration / 6;
         Live.InsertAnimation(container, '<span class="TextAnimation" style="display:none;">' + text + '</span>').find('.TextAnimation').fadeIn(stepDuration).fadeOut(stepDuration).fadeIn(stepDuration).fadeOut(stepDuration).fadeIn(stepDuration).fadeOut(stepDuration);
     },
     InsertAnimation: function(eventRow, content) {
         var height = eventRow.height();
         var margin = height - 35;
         return eventRow.addClass('AnimationContainer').html('<div style="padding:' + margin + 'px 0 ' + margin + 'px 0;">' + content + '</div>');
     },
     Render: function() {
         var eids = new Array();
         var tmp = [];
         var tmpb = [];
         var tmpmt = [];
		 var ustanlatim = [];
		 var ustanlatimb = [];
         var tmpt = [];
         var c = 0;
         var cmt = 0;
		 var j_f_1=1;
		 var j_b_1=1;
         var ct = 0;
		 var liveMenuHtml = "";
		 var liveMenuHtmlB = "";
         var cb = 0;
         var tvtmp = [];
		 clearInterval(livefootballmainint);
	 var tvsay= 0;
	 Live.countrycountbets={};
	 Live.countrycountbets[4]={};
	 Live.countrycountbets[56]={};
	 Live.countrycountbets[5]={};

for (var cu in Live.country[4]) {
var add = true;
var cc = 0;
for (var k in Live.country[4][cu].bets) {
j_f_1++;
if(jQuery.inArray( k, livematch ) !== -1){
if(Live.bets[k].periodtext == "Bitti" || Live.bets[k].farklasayisi>80){
livematch.splice(jQuery.inArray(k, livematch),1);
jQuery('#jq-event-id-'+k+'-live').remove();
jQuery('#ulke_ismi_sil_'+k+'').remove();
jQuery('#details_'+k+'').remove();
}else{
jQuery('#jq-timeCellText-'+k).html(Live.bets[k].diff+".dk");
jQuery('#jq-devreCellText-'+k).html(Live.bets[k].periodtext);
jQuery('#skorbasi-'+k).html(''+Live.bets[k].sch+' - '+Live.bets[k].sca+'');
}
liveMenuHtml = '';
if(Live.bets[k].games && Live.bets[k].diff < Live.lm && Live.bets[k].pid < 4 && Live.bets[k].pid > 0){
$.each(Live.bets[k].games, function(g, b) {
if(b.statu){

if(b.gid==26 || b.gid==27 || b.gid==28 || b.gid==29 || b.gid==30 || b.gid==31){
liveMenuHtml += '<div class="navitem noborder w100 even" style="'+(b.showlines==b.gid ? '':'display:none;')+'" id="navgameslive_'+b.gid+'">';
liveMenuHtml += '<div class="c_3  jq-colCount_1"><div class="c_3  jq-colCount_1">';
} else {
liveMenuHtml += '<div class="navitem noborder w100 even" id="navgameslive_'+b.gid+'">';
liveMenuHtml += '<div class="c_3  jq-colCount_1"><div class="c_3  jq-colCount_1">';
}

if(b.showlines==26){
liveMenuHtml += '<div id="to_1_05_'+k+'" class="type small"><span class="darkgrey">0.5</span></div>';
} else if(b.showlines==27){
liveMenuHtml += '<div id="to_1_15_'+k+'" class="type small"><span class="darkgrey">1.5</span></div>';
} else if(b.showlines==28){
liveMenuHtml += '<div id="to_1_25_'+k+'" class="type small"><span class="darkgrey">2.5</span></div>';
} else if(b.showlines==29){
liveMenuHtml += '<div id="to_1_35_'+k+'" class="type small"><span class="darkgrey">3.5</span></div>';
} else if(b.showlines==30){
liveMenuHtml += '<div id="to_1_45_'+k+'" class="type small"><span class="darkgrey">4.5</span></div>';
} else if(b.showlines==31){
liveMenuHtml += '<div id="to_1_55_'+k+'" class="type small"><span class="darkgrey">5.5</span></div>';
}

$.each(b.oranlar, function(n, o) {

if(o.statu && b.statu && Live.bets[k].games[1] && o.oran!='0.00'){

var qbut = CryptoJS.MD5(b.oyunad+"|"+o.tercih+"|"+k);
liveMenuHtml += '<div class="qbut '+o.image+' qbut-'+qbut+'" oddsid="'+o.brid+'" onclick="canliekle(\''+b.oyunad+'\',\''+o.tercih+'\',\''+o.oran+'\',\''+k+'\',\''+Live.bets[k].spid+'\');void(0);">'+o.oran+'</div>';

}else{
liveMenuHtml += '';
}
});
liveMenuHtml += '</div>';
liveMenuHtml += '</div>';
liveMenuHtml += '</div>';
}
});
}

jQuery('#oranlar_'+k+'').html(liveMenuHtml);

livematch.push(k);

} else {

livematch.push(k);

if (Live.bets[k].status == 1) {
liveMenuHtml = '';
if(j_f_1%2==0){
	var color2 = "odd";
	var color3 = "background: #2e303b;";
} else {
	var color2 = "even";
	var color3 = "background: #606377;";
}

liveMenuHtml += '<div id="ulke_ismi_sil_'+k+'" class="c_1 time pulsation timecell2" style="margin-top: 1px;text-align: right;width: 12%;float: left;'+color3+'">'+ Live.country[4][cu].countryname.toUpperCase() +' <span class="icon_flag cc-'+ cu +'"></span></div><div id="jq-event-id-'+k+'-live" class="row cf event-row jq-event-row  '+color2+'" data-event-id="'+k+'" style="width:88%;">';

if (Live.bets[k].pid == 0) {
liveMenuHtml += '<div class="canli-item-b" id="eventCurrentStandings_' + k + '">Başlama Tarihi<span>Saat: ' + Live.bets[k].sht + '</span></div>';
liveMenuHtml += '<div id="jq-liveEventTimeCell-'+k+'-live" class="c_1 time pulsation timecell2"><div id="jq-timeCellText-'+k+'">' + Live.bets[k].sht + '<span></span></div></div>';
liveMenuHtml += '<div id="jq-devreCellText-'+k+'" style="width: 75px;display: block;float: left;color: #126f8e;text-align: center;min-height: 5px;" class="ng-binding">Başlamadı</div>';
} else {
liveMenuHtml += '<div id="jq-liveEventTimeCell-'+k+'-live" class="c_1 time pulsation timecell2"><div id="jq-timeCellText-'+k+'">' + Live.bets[k].diff + '<span>.dk</span></div></div>';
liveMenuHtml += '<div id="jq-devreCellText-'+k+'" style="width: 75px;display: block;float: left;color: #126f8e;text-align: center;min-height: 5px;" class="ng-binding">' + Live.bets[k].periodtext + '</div>';
}
liveMenuHtml += '<div class="c_2 " style="width:265px;cursor:pointer"><div class="team redcard-holder redcard_0 ">' + Live.bets[k].hteam + '</div><div class="score" id="skorbasi-'+k+'">' + Live.bets[k].sch + ' - ' + Live.bets[k].sca + '</div><div class="team redcard-holder redcard_0 ">' + Live.bets[k].ateam + '</div></div><div id="oranlar_'+k+'">';

if(Live.bets[k].games && Live.bets[k].diff < Live.lm && Live.bets[k].pid < 4 && Live.bets[k].pid > 0){
$.each(Live.bets[k].games, function(g, b) {
if(b.statu){

if(b.gid==26 || b.gid==27 || b.gid==28 || b.gid==29 || b.gid==30 || b.gid==31){
liveMenuHtml += '<div class="navitem noborder w100 even" style="'+(b.showlines==b.gid ? '':'display:none;')+'" id="navgameslive_'+b.gid+'">';
liveMenuHtml += '<div class="c_3  jq-colCount_1"><div class="c_3  jq-colCount_1">';
} else {
liveMenuHtml += '<div class="navitem noborder w100 even" id="navgameslive_'+b.gid+'">';
liveMenuHtml += '<div class="c_3  jq-colCount_1"><div class="c_3  jq-colCount_1">';
}

if(b.showlines==26){
liveMenuHtml += '<div id="to_1_05_'+k+'" class="type small"><span class="darkgrey">0.5</span></div>';
} else if(b.showlines==27){
liveMenuHtml += '<div id="to_1_15_'+k+'" class="type small"><span class="darkgrey">1.5</span></div>';
} else if(b.showlines==28){
liveMenuHtml += '<div id="to_1_25_'+k+'" class="type small"><span class="darkgrey">2.5</span></div>';
} else if(b.showlines==29){
liveMenuHtml += '<div id="to_1_35_'+k+'" class="type small"><span class="darkgrey">3.5</span></div>';
} else if(b.showlines==30){
liveMenuHtml += '<div id="to_1_45_'+k+'" class="type small"><span class="darkgrey">4.5</span></div>';
} else if(b.showlines==31){
liveMenuHtml += '<div id="to_1_55_'+k+'" class="type small"><span class="darkgrey">5.5</span></div>';
}

$.each(b.oranlar, function(n, o) {
if(o.statu && b.statu && Live.bets[k].games[1] && o.oran!='0.00'){

var qbut = CryptoJS.MD5(b.oyunad+"|"+o.tercih+"|"+k);
liveMenuHtml += '<div class="qbut '+o.image+' qbut-'+qbut+'" oddsid="'+o.brid+'" onclick="canliekle(\''+b.oyunad+'\',\''+o.tercih+'\',\''+o.oran+'\',\''+k+'\',\''+Live.bets[k].spid+'\');void(0);">'+o.oran+'</div>';

}else{
liveMenuHtml += '';
}
});
liveMenuHtml += '</div>';
liveMenuHtml += '</div>';
liveMenuHtml += '</div>';
}
});
}

liveMenuHtml += '</div>';

liveMenuHtml += '<div class="c_3 next_more aligned" style="width: 30px;height:25px;"><div id="macdetayac'+k+'" onclick="Live.Details.Open('+k+');"><div><span><i class="fa fa-angle-double-right" style="font-size: 20px;"></i></span></div></div><div id="macdetaykapat'+k+'" style="display:none;" onclick="Live.ClosedDetail('+k+');"><div><span><i class="fa fa-angle-double-down" style="font-size: 20px;"></i></span></div></div></div>';

liveMenuHtml += '<div class="clear"></div>';

liveMenuHtml += '</div>';

liveMenuHtml += '<div id="details_'+k+'" kayit_id="'+k+'" class="e_active jq-special-bet-layer e_comp_ref cmatchdetail"></div>';


c++;
cc++;

}
jQuery("#liveEventsRight").before(liveMenuHtml);
}

}

}




for (var cu in Live.country[56]) {
             var addmt = true;
             var ccmt = 0;
             for (var k in Live.country[56][cu].bets) {
                 if (Live.bets[k].status == 1) {
                     if (addmt) {
                         tmpmt.push('<div class="canli-item-baslik" id="livecountrytoogleclass_'+Live.bets[k].spid+'_' + cu + '"><span class="icon_flag cc-' + cu + '"></span>&nbsp;' + Live.country[56][cu].countryname.toUpperCase() + ' <span id="livecountrybetscount_'+Live.bets[k].spid+'_' + cu + '"></span></div>');
                         tmpmt.push('<div id="livecountryid_'+Live.bets[k].spid+'_' + cu + '">');
                         addmt = false;
                     }
                     tmpmt.push('<div class="canli-item" title="' + Live.bets[k].country + ' ' + Live.bets[k].league + '" id="liveEvent_' + k + '" onclick="javascript:Live.Details.Open(' + k + ')">');
                     tmpmt.push('<div class="canli-item-a" id="eventName_' + k + '">');
                     tmpmt.push(Live.bets[k].hteam + '<span>' + Live.bets[k].sch + '</span>');
                     tmpmt.push('</div>');
                     tmpmt.push('<div class="canli-item-a" id="eventName_' + k + '">');
                     tmpmt.push(Live.bets[k].ateam + '<span>' + Live.bets[k].sca + '</span>');
                     tmpmt.push('</div>');
                     if (Live.bets[k].pid == 0) {
                         tmpmt.push('<div class="canli-item-b" id="eventCurrentStandings_' + k + '">Başlama Tarihi<span>Saat: ' + Live.bets[k].sht + '</span></div>');
                     } else {
                         tmpmt.push('<div class="canli-item-b" id="eventCurrentStandings_' + k + '"><img src="/resources/themes/v1/images/livebet/status_green.gif" alt="Canlı Sunum" height="10" width="10" style="margin-right:5px;">' + Live.bets[k].periodtext + '</div>');
                     }
                     tmpmt.push('</div>');
                     cmt++;
                     ccmt++;
                 }
             }
             tmpmt.push('</div>');
             Live.countrycountbets[Live.bets[k].spid+'_' + cu] = ccmt;
         }
         for (var cu in Live.country[5]) {
             var addt = true;
             var cct = 0;
             for (var k in Live.country[5][cu].bets) {
                 if (Live.bets[k].status == 1) {
                     if (addt) {
                         tmpt.push('<div class="canli-item-baslik" id="livecountrytoogleclass_'+Live.bets[k].spid+'_' + cu + '"><span class="icon_flag cc-' + cu + '"></span>&nbsp;' + Live.country[5][cu].countryname.toUpperCase() + ' <span id="livecountrybetscount_'+Live.bets[k].spid+'_' + cu + '"></span></div>');
                         tmpt.push('<div id="livecountryid_'+Live.bets[k].spid+'_' + cu + '">');
                         addt = false;
                     }
                     tmpt.push('<div class="canli-item" title="' + Live.bets[k].country + ' ' + Live.bets[k].league + '" id="liveEvent_' + k + '" onclick="javascript:Live.Details.Open(' + k + ')">');
                     tmpt.push('<div class="canli-item-a" id="eventName_' + k + '">');
                     tmpt.push(Live.bets[k].hteam + '<span>' + Live.bets[k].sch + '</span>');
                     tmpt.push('</div>');
                     tmpt.push('<div class="canli-item-a" id="eventName_' + k + '">');
                     tmpt.push(Live.bets[k].ateam + '<span>' + Live.bets[k].sca + '</span>');
                     tmpt.push('</div>');
                     if (Live.bets[k].pid == 0) {
                         tmpt.push('<div class="canli-item-b" id="eventCurrentStandings_' + k + '">Başlama Tarihi<span>Saat: ' + Live.bets[k].sht + '</span></div>');
                     } else {
                         tmpt.push('<div class="canli-item-b" id="eventCurrentStandings_' + k + '"><img src="/resources/themes/v1/images/livebet/status_green.gif" alt="Canlı Sunum" height="10" width="10" style="margin-right:5px;">' + Live.bets[k].periodtext + '</div>');
                     }
                     tmpt.push('</div>');
                     ct++;
                     cct++;
                 }
             }
             tmpt.push('</div>');
             Live.countrycountbets[Live.bets[k].spid+'_' + cu] = cct;
         }




for (var cu in Live.country[7]) {
var addb = true;
var ccb = 0;
Live.countrycountbets[7]={};
for (var k in Live.country[7][cu].bets) {
j_b_1++;
if(jQuery.inArray( k, livematchb ) !== -1){
if(Live.bets[k].periodtext == "Bitti" || Live.bets[k].farklasayisi>80){
livematchb.splice(jQuery.inArray(k, livematchb),1);
jQuery('#ulke_ismi_sil_'+k+'').remove();
jQuery('#jq-event-id-'+k+'-live').remove();
jQuery('#details_'+k+'').remove();
}else{
jQuery('#jq-timeCellText-'+k).html(Live.bets[k].diff);
jQuery('#jq-devreCellText-'+k).html(Live.bets[k].periodtext);
jQuery('#skorbasi-'+k).html(''+Live.bets[k].sch+' - '+Live.bets[k].sca+'');
}
liveMenuHtmlB = '';

/// BASKET ORANLAR ////
if(Live.bets[k].periodtext != "Bitti"){
if(Live.bets[k].games[170] && Live.bets[k].games[170].count==2 && Live.bets[k].games[170].statu){
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: 17px;width: 100px;">';
$.each(Live.bets[k].games[170].oranlar, function(n, o) {

var image = "";
image = Live.Details.OddsArrows(k,Live.agames[66], o.brid,Live.OddsFixed(o.oran));

if(o.statu){

var qbut = CryptoJS.MD5("Kim Kazanır|"+o.tercih+"|"+k);

liveMenuHtmlB += '<div class="qbut '+image+' qbut-'+qbut+'" oddsid="'+o.brid+'" onclick="canliekle(\'Kim Kazanır\',\''+o.tercih+'\',\''+o.oran+'\',\''+k+'\',\''+Live.bets[k].spid+'\');void(0);">'+o.oran+'</div>';

}
});
liveMenuHtmlB += '</div></div>';
} else {
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: 17px;width: 100px;">';
liveMenuHtmlB += '<div></div>';
liveMenuHtmlB += '<div></div>';
liveMenuHtmlB += '</div></div>';
}

if(Live.bets[k].games[172] && Live.bets[k].games[172].count==2 && Live.bets[k].games[172].statu){
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: -20px;width: 215px;">';
$.each(Live.bets[k].games[172].oranlar, function(n, o) {

var image = "";
image = Live.Details.OddsArrows(k,Live.agames[102], o.brid,Live.OddsFixed(o.oran));

if(o.statu){
var qbut = CryptoJS.MD5("Toplam Skor Alt/Üst|"+o.tercih+"|"+k);
liveMenuHtmlB += '<div style="width: 50px;margin-right: 4px;margin-top:1px;" class="type small"><span class="darkgrey">'+o.tercih+'</span></div>';
liveMenuHtmlB += '<div class="qbut '+image+' qbut-'+qbut+'" oddsid="'+o.brid+'" onclick="canliekle(\'Toplam Skor Alt/Üst\',\''+o.tercih+'\',\''+o.oran+'\',\''+k+'\',\''+Live.bets[k].spid+'\');void(0);" style="margin-right: 8px;">'+o.oran+'</div>';
}
});
liveMenuHtmlB += '</div></div>';
} else {
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: -20px;width: 215px;">';
liveMenuHtmlB += '<div style="width: 50px;margin-right: 4px;margin-top:1px;" class="type small"><span class="darkgrey"></span></div>';
liveMenuHtmlB += '<div style="margin-right: 8px;"></div>';
liveMenuHtmlB += '<div style="width: 50px;margin-right: 4px;margin-top:1px;" class="type small"><span class="darkgrey"></span></div>';
liveMenuHtmlB += '<div style="margin-right: 8px;"></div>';
liveMenuHtmlB += '</div></div>';
}
}
/// BASKET ORANLAR ////

jQuery('#oranlar_'+k+'').html(liveMenuHtmlB);

livematchb.push(k);

} else {

livematchb.push(k);
liveMenuHtmlB = '';
if (Live.bets[k].status == 1) {

if(j_b_1%2==0){
	var color4 = "odd";
	var color5 = "background: #2e303b;";
} else {
	var color4 = "even";
	var color5 = "background: #606377;";
}

liveMenuHtmlB += '<div id="ulke_ismi_sil_'+k+'" class="c_1 time pulsation timecell2" style="margin-top: 1px;text-align: right;width: 12%;float: left;'+color5+'">'+ Live.country[7][cu].countryname.toUpperCase() +' <span class="icon_flag cc-'+ cu +'"></span></div><div id="jq-event-id-'+k+'-live" class="row cf event-row jq-event-row  '+color4+'" data-event-id="'+k+'" style="width: 88%;">';

if (Live.bets[k].pid == 0) {

liveMenuHtmlB += '<div class="canli-item-b" id="eventCurrentStandings_' + k + '">Başlama Tarihi<span>Saat: ' + Live.bets[k].sht + '</span></div>';
liveMenuHtmlB += '<div id="jq-liveEventTimeCell-'+k+'-live" class="c_1 time pulsation timecell2"><div id="jq-timeCellText-'+k+'">' + Live.bets[k].sht + '<span></span></div></div>';
liveMenuHtmlB += '<div id="jq-devreCellText-'+k+'" style="width: 75px;display: block;float: left;color: #126f8e;text-align: center;min-height: 5px;" class="ng-binding">Başlamadı</div>';

} else {
liveMenuHtmlB += '<div id="jq-liveEventTimeCell-'+k+'-live" class="c_1 time pulsation timecell2"><div id="jq-timeCellText-'+k+'">' + Live.bets[k].diff + '</div></div>';
liveMenuHtmlB += '<div id="jq-devreCellText-'+k+'" style="width: 75px;display: block;float: left;color: #126f8e;text-align: center;min-height: 5px;" class="ng-binding">' + Live.bets[k].periodtext + '</div>';
}


liveMenuHtmlB += '<div class="c_2 " style="width:220px;cursor:pointer"><div class="team redcard-holder redcard_0 ">' + Live.bets[k].hteam + '</div><div class="score" id="skorbasi-'+k+'">' + Live.bets[k].sch + ' - ' + Live.bets[k].sca + '</div><div class="team redcard-holder redcard_0 ">' + Live.bets[k].ateam + '</div></div><div id="oranlar_'+k+'">';


/// BASKET ORANLAR ////
if(Live.bets[k].periodtext != "Bitti"){
if(Live.bets[k].games[170] && Live.bets[k].games[170].count==2 && Live.bets[k].games[170].statu){
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: 17px;width: 100px;">';
$.each(Live.bets[k].games[170].oranlar, function(n, o) {

var image = "";
image = Live.Details.OddsArrows(k,Live.agames[66], o.brid,Live.OddsFixed(o.oran));

if(o.statu){

var qbut = CryptoJS.MD5("Kim Kazanır|"+o.tercih+"|"+k);

liveMenuHtmlB += '<div class="qbut '+image+' qbut-'+qbut+'" oddsid="'+o.brid+'" onclick="canliekle(\'Kim Kazanır\',\''+o.tercih+'\',\''+o.oran+'\',\''+k+'\',\''+Live.bets[k].spid+'\');void(0);">'+o.oran+'</div>';

}
});
liveMenuHtmlB += '</div></div>';
} else {
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: 17px;width: 100px;">';
liveMenuHtmlB += '<div></div>';
liveMenuHtmlB += '<div></div>';
liveMenuHtmlB += '</div></div>';
}

if(Live.bets[k].games[172] && Live.bets[k].games[172].count==2 && Live.bets[k].games[172].statu){
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: -20px;width: 215px;">';
$.each(Live.bets[k].games[172].oranlar, function(n, o) {

var image = "";
image = Live.Details.OddsArrows(k,Live.agames[102], o.brid,Live.OddsFixed(o.oran));

if(o.statu){
var qbut = CryptoJS.MD5("Toplam Skor Alt/Üst|"+o.tercih+"|"+k);
liveMenuHtmlB += '<div style="width: 50px;margin-right: 4px;margin-top:1px;" class="type small"><span class="darkgrey">'+o.tercih+'</span></div>';
liveMenuHtmlB += '<div class="qbut '+image+' qbut-'+qbut+'" oddsid="'+o.brid+'" onclick="canliekle(\'Toplam Skor Alt/Üst\',\''+o.tercih+'\',\''+o.oran+'\',\''+k+'\',\''+Live.bets[k].spid+'\');void(0);" style="margin-right: 8px;">'+o.oran+'</div>';
}
});
liveMenuHtmlB += '</div></div>';
} else {
liveMenuHtmlB += '<div class="navitem noborder w100 even" id="navgameslive_1">';
liveMenuHtmlB += '<div class="c_3  jq-colCount_1" style="margin-left: -20px;width: 215px;">';
liveMenuHtmlB += '<div style="width: 50px;margin-right: 4px;margin-top:1px;" class="type small"><span class="darkgrey"></span></div>';
liveMenuHtmlB += '<div style="margin-right: 8px;"></div>';
liveMenuHtmlB += '<div style="width: 50px;margin-right: 4px;margin-top:1px;" class="type small"><span class="darkgrey"></span></div>';
liveMenuHtmlB += '<div style="margin-right: 8px;"></div>';
liveMenuHtmlB += '</div></div>';
}
}
/// BASKET ORANLAR ////

liveMenuHtmlB += '</div>';

liveMenuHtmlB += '<div class="c_3 next_more aligned" style="width: 30px;height:25px;"><div id="macdetayac'+k+'" onclick="Live.Details.Open('+k+');"><div><span><i class="fa fa-angle-double-right" style="font-size: 20px;"></i></span></div></div><div id="macdetaykapat'+k+'" style="display:none;" onclick="Live.ClosedDetail('+k+');"><div><span><i class="fa fa-angle-double-down" style="font-size: 20px;"></i></span></div></div></div>';

liveMenuHtmlB += '<div class="clear"></div>';

liveMenuHtmlB += '</div>';

liveMenuHtmlB += '<div id="details_'+k+'" kayit_id="'+k+'" class="e_active jq-special-bet-layer e_comp_ref cmatchdetail"></div>';

cb++;
ccb++;
}
$('#liveEventsRightb').before(liveMenuHtmlB);
}

}
}

ustanlatim.push('<marquee behavior="scroll" scrollamount="4" scrolldelay="10" direction="left" class="newser" style="height: 23px;margin-top: 8px;">');

for (var cu in Live.country[4]) {
for (var k in Live.country[4][cu].bets) {
if (Live.bets[k].status == 1) {

ustanlatim.push('<font style="color: #000;padding: 0 10px 0 20px;font-size: 15px;border-left: 2px solid #999;cursor: pointer;" onclick="Live.Details.Open('+k+');">'+Live.bets[k].hteam+' <span style="font-weight: bold;color: #f00;">' + Live.bets[k].sch + ':' + Live.bets[k].sca + '</span> '+Live.bets[k].ateam+'</font>');

}
}
}

ustanlatim.push('</marquee>');

ustanlatimb.push('<marquee behavior="scroll" scrollamount="4" scrolldelay="10" direction="left" class="newser" style="height: 23px;margin-top: 8px;">');

for (var cu in Live.country[7]) {
for (var k in Live.country[7][cu].bets) {
if (Live.bets[k].status == 1) {

ustanlatimb.push('<font style="color: #000;padding: 0 10px 0 20px;font-size: 15px;border-left: 2px solid #999;cursor: pointer;" onclick="Live.Details.Open('+k+');">'+Live.bets[k].hteam+' <span style="font-weight: bold;color: #f00;">' + Live.bets[k].sch + ':' + Live.bets[k].sca + '</span> '+Live.bets[k].ateam+'</font>');

}
}
}

ustanlatimb.push('</marquee>');

$('#ustanlatimlar').empty().html(ustanlatim.join(''));
$('#ustanlatimlar2').empty().html(ustanlatimb.join(''));

$('#liveEventsRightmtenis').empty().html(tmpmt.join(''));
$('#liveEventsRighttenis').empty().html(tmpt.join(''));
$('#videonl').empty().html(tvtmp.join(''));
Live.HideCountry();
this.CheckGoal();
},




     OddsFixed: function(rate) {
	 if(parseFloat(Live.maxliveodd)>0 && rate>parseFloat(Live.maxliveodd))
	 {
	 return parseFloat(Live.maxliveodd).toFixed(2);
	 }

         if (Live.orktr == 1) {
         if(rate> 55){
			 degisim = "50.00";
		 } else if(rate> 10){
			 degisim = parseFloat(rate - "3.50").toFixed(2);
		 } else if(rate> 5){
			 degisim = parseFloat(rate - "1.50").toFixed(2);
		 } else if(rate> 3){
			 degisim = parseFloat(rate - "0.30").toFixed(2);
		 } else if(rate> 2){
			 degisim = parseFloat(rate - "0.20").toFixed(2);
		 } else if(rate> 1.60 && rate < 2.01){
			 degisim = parseFloat(rate - "0.20").toFixed(2);
		 }  else {
			 degisim = parseFloat(rate).toFixed(2);
		 }
     } else if (Live.orktr == 2) {
         if(rate > 55){
			 degisim = "50.00";
		 } else if(rate > 10){
			 degisim = parseFloat(rate - "4.20").toFixed(2);
		 } else if(rate > 5){
			 degisim = parseFloat(rate - "1.70").toFixed(2);
		 } else if(rate > 3){
			 degisim = parseFloat(rate - "0.50").toFixed(2);
		 } else if(rate > 2){
			 degisim = parseFloat(rate - "0.40").toFixed(2);
		 } else if(rate > 1.60 && rate < 2.01){
			 degisim = parseFloat(rate - "0.30").toFixed(2);
		 } else if(rate > 1.30 && rate < 1.60){
			 degisim = parseFloat(rate - "0.30").toFixed(2);
		 } else {
			 degisim = parseFloat(rate).toFixed(2);
		 }
     } else if (Live.orktr == 3) {
         if(rate> 60){
			 degisim = "60.00";
		 } else if(rate> 10){
			 degisim =  parseFloat(rate - "4.30").toFixed(2);
		 } else if(rate> 5){
			 degisim =  parseFloat(rate - "1.80").toFixed(2);
		 } else if(rate> 3){
			 degisim =  parseFloat(rate - "0.60").toFixed(2);
		 } else if(rate> 2){
			 degisim =  parseFloat(rate - "0.50").toFixed(2);
		 } else if(rate> 1.00 && rate < 1.30){
			 degisim =  parseFloat(rate - "0.40").toFixed(2);
		 } else {
			 degisim =  parseFloat(rate).toFixed(2);
		 }
     } else {
			 degisim = rate;
     }
	 
         return degisim;
     },
     OddsFixedcb: function(rate) {
	 if(parseFloat(Live.maxliveodd)>0 && rate>parseFloat(Live.maxliveodd))
	 {
	 return parseFloat(Live.maxliveodd).toFixed(2);
	 }
         if (Live.cborktr == 1) {
         if(rate> 55){
			 degisim = "50.00";
		 } else if(rate> 10){
			 degisim = parseFloat(rate - "3.50").toFixed(2);
		 } else if(rate> 5){
			 degisim = parseFloat(rate - "1.50").toFixed(2);
		 } else if(rate> 3){
			 degisim = parseFloat(rate - "0.30").toFixed(2);
		 } else if(rate> 2){
			 degisim = parseFloat(rate - "0.20").toFixed(2);
		 } else if(rate> 1.60 && rate < 2.01){
			 degisim = parseFloat(rate - "0.20").toFixed(2);
		 }  else {
			 degisim = parseFloat(rate).toFixed(2);
		 }
     } else if (Live.cborktr == 2) {
         if(rate > 55){
			 degisim = "50.00";
		 } else if(rate > 10){
			 degisim = parseFloat(rate - "4.20").toFixed(2);
		 } else if(rate > 5){
			 degisim = parseFloat(rate - "1.70").toFixed(2);
		 } else if(rate > 3){
			 degisim = parseFloat(rate - "0.50").toFixed(2);
		 } else if(rate > 2){
			 degisim = parseFloat(rate - "0.40").toFixed(2);
		 } else if(rate > 1.60 && rate < 2.01){
			 degisim = parseFloat(rate - "0.30").toFixed(2);
		 } else if(rate > 1.30 && rate < 1.60){
			 degisim = parseFloat(rate - "0.30").toFixed(2);
		 } else {
			 degisim = parseFloat(rate).toFixed(2);
		 }
     } else if (Live.cborktr == 3) {
         if(rate> 60){
			 degisim = "60.00";
		 } else if(rate> 10){
			 degisim =  parseFloat(rate - "4.30").toFixed(2);
		 } else if(rate> 5){
			 degisim =  parseFloat(rate - "1.80").toFixed(2);
		 } else if(rate> 3){
			 degisim =  parseFloat(rate - "0.60").toFixed(2);
		 } else if(rate> 2){
			 degisim =  parseFloat(rate - "0.50").toFixed(2);
		 } else if(rate> 1.00 && rate < 1.30){
			 degisim =  parseFloat(rate - "0.40").toFixed(2);
		 } else {
			 degisim =  parseFloat(rate).toFixed(2);
		 }
     } else {
			 degisim = rate;
     }
         return degisim;
     },
     OddsFixedcbd: function(rate) {
	 if(parseFloat(Live.maxliveodd)>0 && rate>parseFloat(Live.maxliveodd))
	 {
	 return parseFloat(Live.maxliveodd).toFixed(2);
	 }
         if (Live.cbdorktr == 0 || rate < 1.20) {
             return rate;
         }
         if (rate < 10) {
             fl = Math.floor(rate);
             degisim = parseFloat(fl * Live.cbdorktr * 0.05).toFixed(2);
         } else if (rate >= 10 && rate <= 100) {
             fl = Math.floor(rate / 10);
             degisim = parseFloat(fl * Live.cbdorktr * 1).toFixed(2);
         } else {
             fl = Math.floor(rate / 100);
             degisim = parseFloat(fl * Live.cbdorktr * 5).toFixed(2);
         }
         rate = parseFloat(rate - degisim).toFixed(2);
         return rate;
     },
     fixedoddforlive: function(spid,rate) {
	if(spid==4)
	{
	rate=Live.OddsFixed(rate);
	}else 	if(spid==7)
	{
	rate=Live.OddsFixedcb(rate);
	}else{
	rate=Live.OddsFixedcbd(rate);
	}
	return rate;
     },
     Translate: function(text) {
         text = text.replace('Suspended', 'Askıya alındı');
         text = text.replace('Red card to', 'Kırmızı kart');
         text = text.replace('Yellow card to', 'Sarı kart');
         text = text.replace('Goal kick to', 'Kale vuruşu');
         text = text.replace('Corner to', 'Köşe vuruşu');
         text = text.replace('Halftime', 'Devre arası');
         text = text.replace('Free kick to', 'Serbest vuruş');
         text = text.replace('Throw in to', 'Taç atışı');
         text = text.replace('1st Half', 'İlkyarı');
         text = text.replace('No clear indication of added time', 'uzatmalar gösteriliyor');
         text = text.replace('2nd Half', 'İkinci yarı');
         text = text.replace('Goal for', 'Gol');
         text = text.replace('Goal by', 'Gol');
         text = text.replace('added time', 'eklenen süre');
         text = text.replace('minutes', 'dakika');
         text = text.replace('minute', 'dakika');
         text = text.replace('by penalty', 'penaltıdan atıldı');
         text = text.replace('scored by shot', 'şutla atıldı');
         text = text.replace('Players are coming out', 'Oyuncular sahaya çıkıyor');
         text = text.replace('Game about to start', 'Maç başlamak üzere');
         text = text.replace('Offside to', 'Ofsayt');
         text = text.replace('Substitution', 'Oyuncu degisikligi');
         text = text.replace('Finished', 'Sona erdi');
         text = text.replace('Regular time over', 'Normal süre sona erdi');
         text = text.replace('minutes', 'dakika');
         text = text.replace('by head', 'kafa vurusu');
         text = text.replace('Photo taking', 'Fotograf cektiriliyor');
         text = text.replace('National anthem singing', 'Ulusal marş okunuyor');
         text = text.replace('Shake hands', 'oyuncular tokalaşıyor');
         text = text.replace('by shot', 'Sutla atıldı');
         text = text.replace('goal kick', 'kale vuruşu');
         text = text.replace('Last to happen', 'son gerçekleşen olay');
         text = text.replace('Players lined up', 'Oyuncular sıra halinde diziliyor');
         text = text.replace('Penalty awarded to', 'Penaltı vuruşu');
         text = text.replace('Penalty missed', 'Penaltıyı atamadı');
         text = text.replace('penalty missed', 'Penaltıyı atamadı');
         text = text.replace('Kick-off', 'Başlama vuruşu');
         text = text.replace('First goalkeeper', 'İlk kale vuruşu');
         text = text.replace('First team to 3 Throw ins in 1st Half', '1.yarıda hangi takım 3 atışına daha önce ulaşır');
         text = text.replace('First team to 3 Throw ins in match', 'Karşılaşamda hangi takım 3 atışına daha önce ulaşır');
         text = text.replace('1st', '1.');
         text = text.replace('2nd', '2.');
         text = text.replace('3rd', '3.');
         text = text.replace('4th', '4.');
         text = text.replace('5th', '5.');
         text = text.replace('6th', '6.');
         text = text.replace('7th', '7.');
         text = text.replace('8th', '8.');
         text = text.replace('9th', '9.');
         text = text.replace('10th', '10.');
         text = text.replace('11th', '11.');
         text = text.replace('12th', '12.');
         text = text.replace('13th', '13.');
         text = text.replace('Extra Time over', 'Uzatmalar Bitti');
         return text
     },
     GameTranslate: function(text) {
         text = text.replace('Team 1 to win and both teams to score', '1. takım kazanır ve iki takım da gol atar');
         text = text.replace('Team 2 to win and both teams to score', '2. takım kazanır ve iki takım da gol atar');
         text = text.replace('Team 1 to win to nil', '1. takım gol yemeden kazanır');
         text = text.replace('Team 2 to win to nil', '2. takım gol yemeden kazanır');
         text = text.replace('Both teams not to score', 'İki takım da gol atamaz');
         text = text.replace('Both teams to score and the match to end in a draw', 'İki takım da gol atar ve maç berabere biter');
         text = text.replace('No goal', '0');
         text = text.replace('3 or more', '3 veya daha fazla gol');
         text = text.replace('Exactly 1 Goal', 'Tam 1 gol');
         text = text.replace('Exactly 2 Goals', 'Tam 2 gol');
         text = text.replace('Exactly 3 Goals', 'Tam 3 gol');
         text = text.replace('Exactly 4 Goals', 'Tam 4 gol');
         text = text.replace('5 goals', 'Tam 5 gol');
         text = text.replace('6 goals', 'Tam 6 gol');
         text = text.replace('7 goals', 'Tam 7 gol');
         text = text.replace('8 or more Goals', '8 veya üstü gol');
         text = text.replace('Under', 'Alt');
         text = text.replace('Over', 'Üst');
         text = text.replace('Yes', 'Evet');
         text = text.replace('No', 'Hayır');
         text = text.replace('Odd', 'Tek');
         text = text.replace('Even', 'Çift');
         text = text.replace('Any other score', 'Başka bir sonuç');
         text = text.replace('1-0, 2-0 or 3-0', '1:0, 2:0 veya 3:0');
         text = text.replace('0-1, 0-2 or 0-3', '0:1, 0:2 veya 0:3');
         text = text.replace('4-0, 5-0 or 6-0', '4:0, 5:0 veya 6:0');
         text = text.replace('0-4, 0-5 or 0-6', '0:4, 0:5 veya 0:6');
         text = text.replace('2-1, 3-1 or 4-1', '2:1, 3:1 veya 4:1');
         text = text.replace('1-2, 1-3 or 1-4', '1:2, 1:3 veya 1:4');
         text = text.replace('3-2, 4-2, 4-3 or 5-1', '3:2, 4:2, 4:3 veya 5:1');
         text = text.replace('2-3, 2-4, 3-4 or 1-5', '2:3, 2:4, 3:4 ya da 1:5');
         text = text.replace('Team 1 to win by any other Score', '1. takım başka bir skorla kazanır');
         text = text.replace('Team 2 to win by any other score', '2. takım başka bir skorla kazanır');
         text = text.replace('Draw', 'Berabere');
         return text
     },
     FindSwf: function(flash) {
         var swf;
         if (window.document[flash]) {
             swf = window.document[flash];
         }
         if (navigator.appName.indexOf("Microsoft Internet") == -1) {
             if (document.embeds && document.embeds[flash]) {
                 swf = document.embeds[flash];
             }
         } else {
             swf = document.getElementById(flash);
         }
         return swf;
     },
     Gol: function() {
         var swfTarget = this.FindSwf("ball");
       //  swfTarget.GotoFrame(2);
     },
     DudukCal: function() {
         var swfTarget = this.FindSwf("ball");
      //   swfTarget.GotoFrame(3);
     },
     Search: function() {
         var searchstring = $('#livesearchinput').val();
         var c = 0;
         if (searchstring.length == 0) {
             $('#live_ac_results').hide();
             return;
         }
         var bulundu = false;
         var patt1 = new RegExp(searchstring, "ig");
         $html = [];
         $html.push('<ul class="dropdown-menu ng-isolate-scope" style="float: left;display: block;font-size: 12px;" id="innerlivesearchresult">');
         for (var eid in Live.bets) {
             if (Live.bets[eid].status == 1 && (Live.bets[eid].hteam.match(patt1) || Live.bets[eid].ateam.match(patt1) || Live.bets[eid].country.match(patt1))) {
                 if (c < 9) {
					 $html.push('<li class="uib-typeahead-match ng-scope">');
					 $html.push('<a href="javascript:;" onclick="Live.Details.Open(' + eid + ');SearchCloser();" class="ng-binding ng-scope" style="font-size: 12px;" title="' + Live.bets[eid].hteam + '-' + Live.bets[eid].ateam + '">' + Live.bets[eid].hteam + '-' + Live.bets[eid].ateam + '</a>');
					 $html.push('</li>');
                 }
                 c++;
             }
         }
         if (!c) {
             $html.push('<li class="uib-typeahead-match ng-scope" ng-repeat="(kyose,sbets) in Searchinlive"><a href="javascript:;" onclick="SearchCloser();" class="ng-binding ng-scope" style="font-size: 12px;" title="Sonuç Bulunmadı">Sonuç Bulunmadı</a></li>');
         }
         $html.push('</ul>');
         $('#live_ac_results').empty().html($html.join('')).show();
     },
     Details: {
         pid: -1,
         eskioranlar: new Array(),
         kapatilanlar: new Array(),
         ehandler: null,
         ehandlerperiyod: 10 * 1000,
         eventid: 0,
         bahis: {},
         oyunlar: {},
         sorter: {},
         radarpanel: false,
         animkey: '',
         grupid: 1,
         golbet: {},
         data: null,

Open: function(liveid) {

tiklananid=liveid;
var kayit_id = $(this).attr('kayit_id');

if(Live.bets[liveid].spid=="7"){

tmpsler = '<div id="LiveContentDetails" class="match-detail-container event-table ng-scope"><div id="statsdiv_'+liveid+'" class="livestatsdiv"><div class="ipe-InPlayScoreboardContainer_BG ipe-InPlayScoreboardContainer_BG7" style=""><div class="header rounded-top"><div class="icons"><ul id="ustanlatimlar'+liveid+'" class="lb-icon-container"></ul></div><div class="league"><span class="live-icon sports _0 _7"></span><span class="live-icon _live"></span><span class="name ng-binding" id="leagueisminiver">---</span></div></div><div id="istatistikanlatim" class="content ng-scope"><div class="statistics GeneralPairGame"><div class="gameTemplate"><div><div><table class="title"><tbody><tr><td class="participant _1"><div class="player-name-container has-gear"><div class="jersey ng-scope" style="float: right;margin-left: 2px;"><span class="gear"><span id="hometeamtshirt" class="tshirt" style="color:#000">_</span><span id="hometeamshort" class="shorts" style="color:#000">@</span></span></div><div class="player-name"><span style="color: #fff;" class="participantName name ng-binding" id="homeTeam">---</span></div></div></td><td><span class="score"><span class="counter-number player1"><span style="color: #fff;margin-top:5px;" id="homeScore" class="ng-binding">---</span></span><span class=" counter-number divider"><span style="color: #fff;margin-top:5px;">:</span></span><span class="counter-number player2"><span style="color: #fff;margin-top:5px;" id="awayScore" class="ng-binding">---</span></span></span></td><td class="participant _2"><div class="player-name-container has-gear"><div class="jersey ng-scope" style="float: left;margin-right: 2px;"><span class="gear"><span id="awayteamtshirt" class="tshirt" style="color:#fff">_</span><span id="awayteamshort" class="shorts" style="color:#fff">@</span></span></div><div class="player-name"><span style="color: #fff;" class="participantName name ng-binding" id="awayTeam">---</span></div></div></td></tr></tbody></table><span class="period"><span><span id="periodComment" class="ng-binding">---</span> <span class="time" id="time">---</span></span></span></div></div></div><div class="scoreboard-common"><div class="extended ng-scope"><div class="extended-stats"><div class="view-menu"><div class="item-list"><span class="menu-item selected" id="anlatimsiz1'+liveid+'" onclick="anlatimlar('+liveid+',1)"><span>Sayılarla maç</span><span class="highlight"></span></span><span class="menu-item" id="anlatimli1'+liveid+'" onclick="anlatimlar('+liveid+',2)"><span>Anlatım</span><span class="highlight"></span></span></div></div><div><div class="template sport-bg-color message-board ng-scope" id="anlatimli'+liveid+'" style="display:none;"><div class="live-scrollbar active"><div class="viewport"><div class="overview" style="top: 0px;"><table><tbody id="messagesanlatimver"></tbody></table></div></div></div></div><div class="template sport-bg-color match-stats stats ng-scope" id="anlatimsiz'+liveid+'"><div class="ng-scope"><table><tbody><tr class="stat-header darker" style="text-align:center;"><td class="filter"></td><td class="value" style="color:#fff;" title="1.Çeyrek">1.Ç</td><td class="value" style="color:#fff;" title="2.Çeyrek">2.Ç</td><td class="value" style="color:#fff;" title="İlk Yarı">İY</td><td class="value" style="color:#fff;" title="3.Çeyrek">3.Ç</td><td class="value" style="color:#fff;" title="4.Çeyrek">4.Ç</td></tr><tr class="team team-1" style="text-align:center;"><td class="player"><div class="player-name-container has-gear"><div class="jersey"><span class="gear"><span class="tshirt" style="color:#000">_</span><span class="shorts" style="color:#000">@</span></span></div><div class="player-name"><span style="color: #fff;" id="statsHomeTeam" class="participantName name ng-binding"></span></div></div></td><td style="color: #fff;" id="statsPrevHomeGoalsb" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeGoalsb" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeRedCardsb" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeCornersb" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeYellowCardsb" class="value ng-binding"></td></tr><tr class="team team-2" style="text-align:center;"><td class="player"><div class="player-name-container has-gear"><div class="jersey"><span class="gear"><span class="tshirt" style="color:#fff">_</span><span class="shorts" style="color:#fff">@</span></span></div><div class="player-name"><span style="color: #fff;" id="statsAwayTeam" class="participantName name ng-binding"></span></div></div></td><td style="color: #fff;" id="statsPrevAwayGoalsb" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayGoalsb" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayRedCardsb" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayCornersb" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayYellowCardsb" class="value ng-binding"></td></tr></tbody></table></div></div></div></div></div></div></div></div></div></div><div style="width: auto" id="mainBet"></div>';

} else if(Live.bets[liveid].spid=="56"){

$("#scoreboard").attr("style", "width:auto;height:218px;background-position: center top;background-image:url('/resources/themes/v1/images/spid_56.jpg');");
$('#soccerScoreboard').hide();
$('#tenistable').show();

} else if(Live.bets[liveid].spid=="5"){

$("#scoreboard").attr("style", "width:auto;height:218px;background-position: center top;background-image:url('/resources/themes/v1/images/spid_56.jpg');");
$('#soccerScoreboard').hide();
$('#tenistable').show();

} else {

tmpsler = '<div id="LiveContentDetails" class="match-detail-container event-table ng-scope">';

tmpsler += '<div class="livescoreboard livescoreboard36 livestatsdiv" style="display:block;" id="livescoreboard"><div class="header rounded-top"><div class="icons"><ul id="ustanlatimlar" class="lb-icon-container">';

if(Live.bets[liveid].radarid>10){

tmpsler += '<li class="goperform stats lb-icon-item ng-scope" onclick="javascript:Live.Details.OpenStatics();void(0);"><a class="statistics lb-icon-button" title="Sayılarla maç"><span style="background-position: -135px -128px;" class="live-icon _stats_button lb-icon-button-icon" title="2.Animasyonu Başlat."></span></a></li>';

tmpsler += '<li class="radarstatsds lb-icon-item ng-scope" onclick="ChangeScoreBoardCanli(1,'+liveid+','+Live.bets[liveid].radarid+',\''+Live.bets[liveid].hteam+'\',\''+Live.bets[liveid].ateam+'\');"><div class="simulation lb-icon-button"><span class="live-icon lb-icon-button-icon _simulation-active" title="Animasyonu Başlat."></span></div></li>';

}

if(Live.bets[liveid].matchsimulation!=''){

tmpsler += '<li class="radarstatsds lb-icon-item ng-scope" onclick="ChangeScoreBoardCanli(2,'+liveid+',\''+Live.bets[liveid].matchsimulation+'\',\''+Live.bets[liveid].hteam+'\',\''+Live.bets[liveid].ateam+'\');"><div class="simulation lb-icon-button"><span class="live-icon lb-icon-button-icon _simulation-active" title="2.Animasyonu Başlat." style="background-position: -551px -128px;"></span></div></li>';

}

if(Live.bets[liveid].radarid>10 || Live.bets[liveid].matchsimulation!=''){

tmpsler += '<li class="nstats lb-icon-item ng-scope" onclick="ChangeScoreBoardCanli(3,'+liveid+',1,1,1);"><div class="stats lb-icon-button"><span class="live-icon lb-icon-button-icon video-icon-gomainsecreedn" title="Ana Ekrana Dön"></span></div></li>';

}

tmpsler += '</ul></div></div><div class="livescoreboard-content collapse in" id="livescore-close"></div></div>';









tmpsler += '<div id="statsdiv_'+liveid+'" class="livestatsdiv"><div class="ipe-InPlayScoreboardContainer_BG ipe-InPlayScoreboardContainer_BG4" style=""><div class="header rounded-top"><div class="icons"><ul id="ustanlatimlar" class="lb-icon-container">';

if(Live.bets[liveid].radarid>10){

tmpsler += '<li class="goperform stats lb-icon-item ng-scope" onclick="javascript:Live.Details.OpenStatics();void(0);"><a class="statistics lb-icon-button" title="Sayılarla maç"><span class="live-icon _stats_button lb-icon-button-icon" title="İstatistik"></span></a></li>';

tmpsler += '<li class="radarstatsds lb-icon-item ng-scope" onclick="ChangeScoreBoardCanli(1,'+liveid+','+Live.bets[liveid].radarid+',\''+Live.bets[liveid].hteam+'\',\''+Live.bets[liveid].ateam+'\');"><div class="simulation lb-icon-button"><span class="live-icon lb-icon-button-icon _simulation-active" title="Animasyonu Başlat."></span></div></li>';

}

if(Live.bets[liveid].matchsimulation!=''){

tmpsler += '<li class="radarstatsds lb-icon-item ng-scope" onclick="ChangeScoreBoardCanli(2,'+liveid+',\''+Live.bets[liveid].matchsimulation+'\',\''+Live.bets[liveid].hteam+'\',\''+Live.bets[liveid].ateam+'\');"><div class="simulation lb-icon-button"><span class="live-icon lb-icon-button-icon _simulation-active" title="2.Animasyonu Başlat." style="background-position: -551px -128px;"></span></div></li>';

}

if(Live.bets[liveid].radarid>10 || Live.bets[liveid].matchsimulation!=''){

tmpsler += '<li class="nstats lb-icon-item ng-scope" onclick="ChangeScoreBoardCanli(3,'+liveid+',1,1,1);"><div class="stats lb-icon-button"><span class="live-icon lb-icon-button-icon video-icon-gomainsecreedn" title="Ana Ekrana Dön"></span></div></li>';

}

tmpsler += '</ul></div><div class="league"><span class="live-icon sports _0 _4"></span><span class="live-icon _live"></span><span class="name ng-binding" id="leagueisminiver">---</span></div></div><div id="istatistikanlatim" class="content ng-scope"><div class="statistics GeneralPairGame"><div class="gameTemplate"><div><div><table class="title"><tbody><tr><td class="participant _1"><div class="player-name-container has-gear"><div class="jersey ng-scope" style="float: right;margin-left: 2px;"><span class="gear"><span id="hometeamtshirt" class="tshirt" style="color:#000">_</span><span id="hometeamshort" class="shorts" style="color:#000">@</span></span></div><div class="player-name"><span style="color: #fff;" class="participantName name ng-binding" id="homeTeam">---</span></div></div></td><td><span class="score"><span class="counter-number player1"><span style="color: #fff;margin-top:5px;" id="homeScore" class="ng-binding">---</span></span><span class=" counter-number divider"><span style="color: #fff;margin-top:5px;">:</span></span><span class="counter-number player2"><span style="color: #fff;margin-top:5px;" id="awayScore" class="ng-binding">---</span></span></span></td><td class="participant _2"><div class="player-name-container has-gear"><div class="jersey ng-scope" style="float: left;margin-right: 2px;"><span class="gear"><span id="awayteamtshirt" class="tshirt" style="color:#fff">_</span><span id="awayteamshort" class="shorts" style="color:#fff">@</span></span></div><div class="player-name"><span style="color: #fff;" class="participantName name ng-binding" id="awayTeam">---</span></div></div></td></tr></tbody></table><span class="period"><span><span id="periodComment" class="ng-binding">---</span> <span class="time" id="time">---</span></span></span></div></div></div><div class="scoreboard-common"><div class="extended ng-scope"><div class="extended-stats"><div class="view-menu"><div class="item-list"><span class="menu-item selected" id="anlatimsiz1'+liveid+'" onclick="anlatimlar('+liveid+',1)"><span>Sayılarla maç</span><span class="highlight"></span></span><span class="menu-item" id="anlatimli1'+liveid+'" onclick="anlatimlar('+liveid+',2)"><span>Anlatım</span><span class="highlight"></span></span></div></div><div><div class="template sport-bg-color message-board ng-scope" id="anlatimli'+liveid+'" style="display:none;"><div class="live-scrollbar active"><div class="viewport"><div class="overview" style="top: 0px;"><table><tbody id="messagesanlatimver"></tbody></table></div></div></div></div><div class="template sport-bg-color match-stats stats ng-scope" id="anlatimsiz'+liveid+'"><div class="ng-scope"><table><tbody><tr class="stat-header darker" style="text-align:center;"><td class="filter"></td><td class="value" title="Goller"><span class="live-icon messages _0 _4_255"></span></td><td class="value" title="Sarı kartlar"><span class="live-icon messages _0 _4_253"></span></td><td class="value" title="Kırmızı kartlar"><span class="live-icon messages _0 _4_254"></span></td><td class="value disabled-stat" title="Korner"><span class="live-icon messages _0 _4_252"></span></td><td class="value" title="Penaltılar"><span class="live-icon messages _0 _4_244"></span></td><td class="value disabled-stat" title="Ofsayt"><span class="live-icon messages _0 _4_250"></span></td></tr><tr class="team team-1" style="text-align:center;"><td class="player"><div class="player-name-container has-gear"><div class="jersey"><span class="gear"><span class="tshirt" style="color:#000">_</span><span class="shorts" style="color:#000">@</span></span></div><div class="player-name"><span style="color: #fff;" id="statsHomeTeam" class="participantName name ng-binding"></span></div></div></td><td style="color: #fff;" id="statsHomeGoals" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeYellowCards" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeRedCards" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeCorners" class="value ng-binding"></td><td style="color: #fff;" id="statsHomePenalties" class="value ng-binding"></td><td style="color: #fff;" id="statsHomeOfsayt" class="value ng-binding">0</td></tr><tr class="team team-2" style="text-align:center;"><td class="player"><div class="player-name-container has-gear"><div class="jersey"><span class="gear"><span class="tshirt" style="color:#fff">_</span><span class="shorts" style="color:#fff">@</span></span></div><div class="player-name"><span style="color: #fff;" id="statsAwayTeam" class="participantName name ng-binding"></span></div></div></td><td style="color: #fff;" id="statsAwayGoals" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayYellowCards" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayRedCards" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayCorners" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayPenalties" class="value ng-binding"></td><td style="color: #fff;" id="statsAwayOfsayt" class="value ng-binding">0</td></tr></tbody></table></div></div></div></div></div></div></div></div></div></div><div style="width: auto" id="mainBet"></div>';

}

$("html, body").stop().animate({scrollTop: $('#macdetayac'+liveid).offset().top - 40}, '500', 'linear');

if(tiklananid==kayit_id){} else { $('.cmatchdetail').html(''); }
$('#macdetayac'+liveid+'').hide();
$('#macdetaykapat'+liveid+'').show();
$('#details_'+liveid+'').html(tmpsler).show();
$('#statsTable').removeClass('bstatsTable');
$('#scoreboard').removeClass('basketback');
this.grupid = 1;
this.RemoveRadarPanel();
this.eventid = liveid;
this.animkey = '';
this.pid = -1;
this.SetSoccerBoard(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
this.SetSoccerBoardBasket(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
$('#leagueisminiver').text(Live.bets[liveid].country + ' ' + Live.bets[liveid].league);
$('#periodComment').text(Live.GetPeriyod(Live.bets[liveid].spid, Live.bets[liveid].pid));
$('#homeTeam').text(Live.bets[liveid].hteam);
$('#awayTeam').text(Live.bets[liveid].ateam);
$('#homeScore').text(Live.bets[liveid].sch);
$('#awayScore').text(Live.bets[liveid].sca);
$('#hometeamtshirt').text(Live.bets[liveid].htshtcolor);
$('#hometeamshort').text(Live.bets[liveid].hshtcolor);
$('#awayteamtshirt').text(Live.bets[liveid].atshtcolor);
$('#awayteamshort').text(Live.bets[liveid].ashtcolor);			 
$('#statsHomeTeam,#statsHomeTeamb').text(Live.bets[liveid].hteam);
$('#statsAwayTeam,#statsAwayTeamb').text(Live.bets[liveid].ateam);
$('#time').text('------');
this.Play(Live.bets[liveid].spid);
},


StopHide: function() {
             if (this.ehandler) {
                 clearInterval(this.ehandler);
                 this.ehandler = null;
             }
             if (this.radarpanel) {
                 this.RemoveRadarPanel();
             }
             $('#LiveContentDetails').hide();
             $('#betsBox').show();
         },
         Play: function(spiddss) {
             this.eskioranlar = new Array();
             this.kapatilanlar = new Array();
	     this.JsonLoader(spiddss);
	if (this.ehandler) {
	clearInterval(this.ehandler);
	this.ehandler = null;
	}
	this.ehandler = setInterval('Live.Details.JsonLoader('+spiddss+')', this.ehandlerperiyod);
         },
         Stop: function() {
             clearInterval(this.ehandler);
             this.ehandler = null;
         },
         Filter: function(grupid) {
             this.grupid = grupid;
             this.JsonParser(this.data);
         },
         RemoveRadarPanel: function() {
             this.radarpanel = false;
             $('#livescoreboard').hide();
             $('#scoreboard').show();
             $('#livescore-close').html('');
         },
         CreateRadarPanel: function(x) {
             this.radarpanel = true;
             if (x == 1) {
                 $('#livescore-close').html('<iframe class="livescoreframe36" src="https://href.li/?https://cs.betradar.com/ls/widgets/?/universalsoftwaresolutions/tr/page/widgets_lmts#matchId=' + this.bahis.radarid + '" id="livescoreframe" hspace="0" vspace="0" marginheight="0" marginwidth="0" scrolling="no" style="display: block;width:678px;height: 352px;" frameborder="0"></iframe>');
             }else if (x == 5) {
                 if (Lib.Utils.IsMobil()) {
                     $('#livescore-close').html('<div class="player" id="videoplayer" style="margin: 0px auto; height: 200px;"><video controls="" style="width:100%;height: 100%;" id="plaIp"><source type="application/x-mpegURL" src="http://' + Live.tvip + '/hls-live/xmlive/_definst_/' + Live.bets[this.eventid].tv + '/' + Live.bets[this.eventid].tv + '.m3u8"></video></div></div>');
                 } else {
                     $('#livescore-close').html('<iframe class="livescoreframe36" src="/tv/VideoPlayerLive.swf?x=0.6483037667376375&userID=0&videoID=' + Live.bets[this.eventid].tv + '&matchName=CANLI YAYIN&startImmediately=false&width=500&height=225" id="livescoreframe" hspace="0" vspace="0" marginheight="0" marginwidth="0" scrolling="no" style="display: block;" frameborder="0"></iframe>');
                 }
             } else if (Live.bets[this.eventid].vc == 2) {
                 if (Lib.Utils.IsMobil()) {
                     $('#livescore-close').html('<div class="player" id="videoplayer" style="margin: 0px auto; height: 200px;"><video controls="" style="width:100%;height: 100%;" id="plaIp"><source type="application/x-mpegURL" src="http://' + Live.tvip + '/hls-live/xmlive/_definst_/' + Live.bets[this.eventid].videoid + '/' + Live.bets[this.eventid].videoid + '.m3u8"></video></div></div>');
                 } else {
                     $('#livescore-close').html('<iframe class="livescoreframe36" src="/resources/swf/VideoPlayerLive.swf?x=0.6483037667376375&userID=0&videoID=' + Live.bets[this.eventid].videoid + '&matchName=CANLI YAYIN&startImmediately=false&width=500&height=225" id="livescoreframe" hspace="0" vspace="0" marginheight="0" marginwidth="0" scrolling="no" style="display: block;" frameborder="0"></iframe>');
                 }
             } else if (this.animkey) {
                 $('#livescore-close').html('<iframe class="livescoreframe36" src="https://href.li/?https://secure.nesine.performgroup.com/streaming/watch/event/index.html?userId=pauline&partnerId=1945&eventId=' + this.animkey + '&streamOnly=false&statsswitch=false&homeTeam=' + Live.bets[this.eventid].hteam.replace(' ', '%c2%a0') + '&awayTeam=' + Live.bets[this.eventid].ateam.replace(' ', '%c2%a0') + '&width=500&lang=tr&version=1.22" id="livescoreframe" hspace="0" vspace="0" marginheight="0" marginwidth="0" scrolling="no" style="display: block;width:500px" frameborder="0"></iframe>');
             } else {
                 this.radarpanel = false;
                 return;
             }
             $('#livescoreboard').show();
             $('#scoreboard').hide();

	     if(this.bahis.radarid>2)
	     {
                 $(".radarstatsds,.nstats").show();
	     }

             if(this.animkey)
	     {
                 $(".goperform").show();
	     }
         },
         ChangeScoreBoard: function(x) {
             if (this.radarpanel) {
                 this.RemoveRadarPanel(x);
             } else {
                 this.CreateRadarPanel(x);
             }
         },
         OpenStatics: function() {
	 var popupwindow=window.open('https://href.li/?https://s5.sir.sportradar.com/totobo/tr/2/match/'+this.bahis.radarid,'Statistics','width=1020,height=700,screenX=10,left=10,screenY=10,top=10,toolbar=no,status=no,location=no,menubar=no,directories=no,scrollbars=needed,resizable=yes');
	 popupwindow.focus();
         },
         SetSoccerBoard: function(a, b, c, d, e, f, g, h, i, j, k, l) {
             $('#statsPrevHomeGoals').text(a);
             $('#statsHomeGoals').text(b);
             $('#statsHomeCorners').text(c);
             $('#statsHomeYellowCards').text(d);
             $('#statsHomeRedCards').text(e);
             $('#statsHomePenalties').text(f);
             $('#statsPrevAwayGoals').text(g);
             $('#statsAwayGoals').text(h);
             $('#statsAwayCorners').text(i);
             $('#statsAwayYellowCards').text(j);
             $('#statsAwayRedCards').text(k);
             $('#statsAwayPenalties').text(l);
         },
         SetSoccerBoardBasket: function(a, b, c, d, e, f, g, h, i, j, k, l) {
             $('#statsPrevHomeGoalsb').text(a);
             $('#statsHomeGoalsb').text(b);
             $('#statsHomeCornersb').text(c);
             $('#statsHomeYellowCardsb').text(d);
             $('#statsHomeRedCardsb').text(i);
             $('#statsHomePenaltiesb').text(j);
             $('#statsPrevAwayGoalsb').text(e);
             $('#statsAwayGoalsb').text(f);
             $('#statsAwayCornersb').text(g);
             $('#statsAwayYellowCardsb').text(h);
             $('#statsAwayRedCardsb').text(k);
             $('#statsAwayPenaltiesb').text(l);
         },
         JsonLoader: function(spidver) {
	this.Template.Debug('Veriler yenileniyor................');
       var eventUrl = Live.xmlserver + "?cmd=details&eventid=" + this.eventid + "&sportipi=" + spidver;
         jQuery.ajax({
              type: "GET",
               url: eventUrl,
              timeout: 10000,
                 dataType: "json",
                 success: function(data) {
                     Live.Details.data = data;
                     Live.Details.JsonParser(data);
                 },
             	 error: function(xhr, ajaxOptions, thrownError) {
                 if (xhr.statusText == "OK") {
                     window.setTimeout(this.JsonLoader, 30 * 1000);
                 } else {
                  window.setTimeout(this.JsonLoader, 15 * 1000);
         }
     }
       });
         },
         JsonParser: function(data) {
             var $bahis = {};
             var $oyunlar = {};
             var $sorter = {};
             var e = this.eventid;
		if(data && Live.bets[this.eventid])
		{
             if (typeof data != 'undefined') {
                 $bahis.eid = parseInt(data.eid);
                 $bahis.lid = parseInt(data.lid);
                 $bahis.league = data.lig;
                 $bahis.country = data.ulke;
                 $bahis.spid = parseInt(data.spid);
                 $bahis.radarid = parseInt(data.radarid);
                 $bahis.home = data.a;
                 $bahis.away = data.h;
                 $bahis.tgol = (parseInt(data.sch)+parseInt(data.sca));
  	     	if(data.pid>0 && $bahis.spid==7) {
	     	$bahis.diffs = data.secound;   
	     	$bahis.period = data.pid;   
	     	}else{
	     	$bahis.diffs = 0;   
	     	$bahis.period = 0;   
              	}
                $bahis.dks = parseInt(12-$bahis.diffs);
		if($bahis.dks<2 && ($bahis.period==1 ||$bahis.period==3 ||$bahis.period==5 ||$bahis.period==7) && $bahis.spid==7)
		{
                $bahis.cyrk = 1;
		}else{
                $bahis.cyrk = 0;
		}

			if($bahis.radarid>0)
			{
			Live.bets[this.eventid].radarid=$bahis.radarid;
			}
                 	if (data.smid) {
                     	this.animkey = data.smid;
                 	}
             if(Live.bets[this.eventid].tv>0)
	     {
                 $(".tvshow").show();
	     }
                 if (typeof data.live != 'undefined') {
                     $.each(data.live, function(k, r) {
                         var gid = parseInt(r.tempid);
                         if (Live.agames[gid]) {
                             var bgid = parseInt(r.id);
                             var oyunad = r.N;
                             var statu = r.o;
                             var colum = r.games.length;
                             var oranlar = {};
                             var count = 0;
                             if (Live.agames[gid] == 1 || Live.agames[gid] == 146 || Live.agames[gid] == 2 || Live.agames[gid] == 3 || Live.agames[gid] == 4 || Live.agames[gid] == 9 || Live.agames[gid] == 10 || Live.agames[gid] == 11 || Live.agames[gid] == 18 || Live.agames[gid] == 73 || Live.agames[gid] == 74 || Live.agames[gid] == 75 || Live.agames[gid] == 76 || Live.agames[gid] == 77 || Live.agames[gid] == 78 || Live.agames[gid] == 85 || Live.agames[gid] == 127 || Live.agames[gid] == 128) {
                                 if (colum == 3) {
                                     for (var i = 0; i < 3; ++i) {
                                         brid = parseInt(r.games[i].Id);
                                         egids = parseInt(r.games[i].EGID);
                                         oran = parseFloat(r.games[i].Odds).toFixed(2);
                                         ostatu = r.games[i].Visible;
                                         if (i == 0) {
                                             tercih = "1";
                                         } else if (i == 2) {
                                             tercih = "2";
                                         } else {
                                             tercih = r.games[i].Name;
                                         }
                                         if (ostatu) {
                                             oranlar[brid] = {
                                                 brid: brid,
                                         	 egids: egids,
                                                 oran: Live.fixedoddforlive($bahis.spid,oran),
                                                 tercih: tercih,
                                                 statu: ostatu
                                             };
                                             count++;
                                         }
                                     }
                                 }
                             } else if (Live.agames[gid] == 16 || Live.agames[gid] == 17) {
                                 if (colum == 3) {
                                     for (var i = 0; i < 3; ++i) {
                                         brid = parseInt(r.games[i].Id);
                                         egids = parseInt(r.games[i].EGID);
                                         oran = parseFloat(r.games[i].Odds).toFixed(2);
                                         ostatu = r.games[i].Visible;
                                         if (i == 0) {
                                             tercih = "1 ve X";
                                         } else if (i == 1) {
                                             tercih = "X ve 2";
                                         } else {
                                             tercih = "1 ve 2";
                                         }
                                         if (ostatu) {
                                             oranlar[brid] = {
                                                 brid: brid,
                                         	 egids: egids,
                                                 oran: Live.fixedoddforlive($bahis.spid,oran),
                                                 tercih: tercih,
                                                 statu: ostatu
                                             };
                                             count++;
                                         }
                                     }
                                 }
                             }else if (Live.agames[gid] == 184 || Live.agames[gid] == 185) {
                                 if (colum == 2) {
                                     for (var i = 0; i < 2; ++i) {
                                         brid = parseInt(r.games[i].Id);
                                         egids = parseInt(r.games[i].EGID);
                                         oran = parseFloat(r.games[i].Odds).toFixed(2);
                                         ostatu = r.games[i].Visible;
                                          tercih = Live.homeawaychange($bahis.home,$bahis.away,r.games[i].Name);
                                        
                                         if (ostatu) {
                                             oranlar[brid] = {
                                                 brid: brid,
                                         	 egids: egids,
                                                 oran: Live.fixedoddforlive($bahis.spid,oran),
                                                 tercih: tercih,
                                                 statu: ostatu
                                             };
                                             count++;
                                         }
                                     }
                                 }
                             }else if (Live.agames[gid] == 19 || Live.agames[gid] == 183 || Live.agames[gid] == 182 || Live.agames[gid] == 170 || Live.agames[gid] == 194 || Live.agames[gid] == 195 || Live.agames[gid] == 196) {
                                 if (colum == 2) {
                                     for (var i = 0; i < 2; ++i) {
                                         brid = parseInt(r.games[i].Id);
                                         egids = parseInt(r.games[i].EGID);
                                         oran = parseFloat(r.games[i].Odds).toFixed(2);
                                         ostatu = r.games[i].Visible;
                                         if (i == 0) {
                                             tercih = "1";
                                         } else if (i == 1) {
                                             tercih = "2";
                                         }
                                         if (ostatu) {
                                             oranlar[brid] = {
                                                 brid: brid,
                                         	 egids: egids,
                                                 oran: Live.fixedoddforlive($bahis.spid,oran),
                                                 tercih: tercih,
                                                 statu: ostatu
                                             };
                                             count++;
                                         }
                                     }
                                 }
                             } else {
                                 $.each(r.games, function(kk, odds) {
                                     brid = parseInt(odds.Id);
                                     egids = parseInt(odds.EGID);
                                     oran = parseFloat(odds.Odds).toFixed(2);
                                     ostatu = odds.Visible;
                                     tercih = odds.Name;
                                     if (Live.agames[gid] == 101 && tercih == 'Başka bir sonuç') {
                                         ostatu = false;
                                     }
                                     if ((Live.agames[gid] == 101 || Live.agames[gid] ==102) && tercih == 'Any other score') {
                                         ostatu = false;
                                     }
                                     if (Live.agames[gid] == 166 && (tercih == 'Team 1 to win by any other Score' || tercih == 'Team 2 to win by any other score')) {
                                         ostatu = false;
                                     }
				     if($bahis.cyrk==1 && $bahis.spid==7 && (Live.agames[gid]==196 ||Live.agames[gid]==195 ||Live.agames[gid]==194 ||Live.agames[gid]==182 ||Live.agames[gid]==185 ||Live.agames[gid]==181 ||Live.agames[gid]==180 ||Live.agames[gid]==165 ||Live.agames[gid]==164 ||Live.agames[gid]==163 || Live.agames[gid]==162))
				     {
                                     ostatu = false;
				     }


                                     if (ostatu) {
                                         oranlar[brid] = {
                                             brid: brid,
                                             egids: egids,
                                             oran: Live.fixedoddforlive($bahis.spid,oran),
                                             tercih: tercih,
                                             statu: ostatu
                                         };
                                         count++;
                                     }
                                 });
                             }
                             if (!Live.Details.golbet[Live.agames[gid]]) {
                                 $oyunlar[bgid] = {
                                     bgid: bgid,
                                     gid: Live.agames[gid],
                                     oyunad: oyunad,
                                     statu: statu,
                                     colum: colum,
                                     count: count,
                                     oranlar: oranlar
                                 };
                                 $sorter[Live.agames[gid]] = bgid;
                             }
                         }
                     });
                 }
             }
		}
             if ($bahis.eid != this.eventid) {
                 return;
             }
             this.bahis = $bahis;
             this.oyunlar = $oyunlar;
             this.sorter = $sorter;
	     if(Live.bets[this.eventid])
	     {
             if (Live.bets[this.eventid].radarid > 2 && $('.livestatsradar').css('display') == 'none') {
                 $(".radarstatsds,.nstats").show();
             }
             if (this.animkey && $('.livestatsradar').css('display') == 'none') {
                 $(".goperform").show();
             }
	     }
                 this.ScoreParser(data);

             if (!this.radarpanel) {
                 var mesaj = [];
                 var mesajmtns = [];
                 var i = 0;
                 $.each(data.Msg, function(a, b) {
                     dakika = (data.spid==4 ? '0':'');
                     if (b.dk) {
                         dakika = (data.spid==4 ? b.dk:'');
                     }
                     text = Live.Translate(b.N);
					 typesi = b.type;
					 mesaj.push('<tr class="message ng-scope"><td class="msg-icon darker"><span class="live-icon messages _0 _'+data.spid+'_'+typesi+'"></span></td><td class="info darker"><span class="time ng-binding">'+dakika+'</span></td><td class="msg ng-binding">'+text+'</td></tr>');
                     mesajmtns.push(text + '');
                     i++;
                 });
                 $('#messagesanlatimver').empty();
                 $('.message-list').empty();
                 if (i) {
                     $('#messagesanlatimver').html(mesaj.join(''));
                     $('.message-list').html(mesajmtns.join(''));
                 }
             }
             if (Live.bets[this.eventid]) {
                 if (Live.bets[this.eventid].status != 1 || Live.bets[this.eventid].pid=="255") {
                     this.StopHide();
                     return;
                 }
		if(Live.bets[this.eventid].spid=="7")
		{
              if (Live.bets[this.eventid].pid > 0 && Live.bets[this.eventid].pid < 8) {
                     this.Template.CreateTemplate($bahis, $oyunlar);
                     return;
                 }
		}else{
                 if(Live.bets[this.eventid].pid==1){
				 
				 if (Live.bets[this.eventid].diff < Live.lmy && (Live.bets[this.eventid].pid > 0 || Live.prematch==1) && Live.bets[this.eventid].pid < 4) {
                     this.Template.CreateTemplate($bahis, $oyunlar);
                     return;
                 }
				 
				 } else if (Live.bets[this.eventid].diff < Live.lm && (Live.bets[this.eventid].pid > 0 || Live.prematch==1) && Live.bets[this.eventid].pid < 4) {
                     this.Template.CreateTemplate($bahis, $oyunlar);
                     return;
                 }
		}

             }
             this.CloseOdds();
             this.Template.CreateTemplate($bahis, $oyunlar);
             return;
         },
         ScoreParser: function(data) {
             var $skor = {};
             if (typeof data != 'undefined') {
                 $skor.eid = parseInt(data.eid);
                 $skor.lid = parseInt(data.lid);
                 $skor.league = data.ulke + " " + data.lig;
                 $skor.spid = parseInt(data.spid);
                 $skor.pid = parseInt(data.pid);
                 $skor.radarid = parseInt(data.radarid);
                 $skor.home = '';
                 $skor.away = '';
             }
	     if($skor.spid=="56" || $skor.spid=="5")
	     {
	     if(data.gseri>5)
	     {
             $('.ptr6,.ptr7,.team-2 .pr6,.team-2 .pr7,.team-1 .pr6,.team-1 .pr7').show();
	     }else{
             $('.ptr6,.ptr7,.team-2 .pr6,.team-2 .pr7,.team-1 .pr6,.team-1 .pr7').hide();
	     }

             $skor.h = parseInt(data.sch);
             $skor.h1 = parseInt(data.periodsh[1]);
             $skor.h2 = parseInt(data.periodsh[2]);
             $skor.h3 = parseInt(data.periodsh[3]);
             $skor.h4 = parseInt(data.periodsh[4]);
             $skor.h5 = parseInt(data.periodsh[5]);
             $skor.h6 = parseInt(data.periodsh[6]);
             $skor.h7 = parseInt(data.periodsh[7]);
             $skor.a = parseInt(data.sca);
             $skor.a1 = parseInt(data.periodsa[1]);
             $skor.a2 = parseInt(data.periodsa[2]);
             $skor.a3 = parseInt(data.periodsa[3]);
             $skor.a4 = parseInt(data.periodsa[4]);
             $skor.a5 = parseInt(data.periodsa[5]);
             $skor.a6 = parseInt(data.periodsa[6]);
             $skor.a7 = parseInt(data.periodsa[7]);
             var periyod = Live.GetPeriyod($skor.spid, $skor.pid);
             $('#homeTeammtns,.team-1 .participantName').text(data.h);
             $('#awayTeammtns,.team-2 .participantName').text(data.a);
             $('#homeScoremtns').text($skor.h);
             $('#awayScoremtns').text($skor.a);
             $('#periodCommentmtns').text(periyod);
             $('#leagueisminiver').text($skor.league + (data.gseri>0 ? ' ('+data.gseri+' Maçlık Seri )':''));
             $('.team-1 .pr1').text(($skor.h1 ? $skor.h1:'-'));
             $('.team-1 .pr2').text(($skor.h2 ? $skor.h2:'-'));
             $('.team-1 .pr3').text(($skor.h3 ? $skor.h3:'-'));
             $('.team-1 .pr4').text(($skor.h4 ? $skor.h4:'-'));
             $('.team-1 .pr5').text(($skor.h5 ? $skor.h5:'-'));
             $('.team-1 .pr6').text(($skor.h6 ? $skor.h6:'-'));
             $('.team-1 .pr7').text(($skor.h6 ? $skor.h7:'-'));

             $('.team-2 .pr1').text(($skor.a1 ? $skor.a1:'-'));
             $('.team-2 .pr2').text(($skor.a2 ? $skor.a2:'-'));
             $('.team-2 .pr3').text(($skor.a3 ? $skor.a3:'-'));
             $('.team-2 .pr4').text(($skor.a4 ? $skor.a4:'-'));
             $('.team-2 .pr5').text(($skor.a5 ? $skor.a5:'-'));
             $('.team-2 .pr6').text(($skor.a6 ? $skor.a6:'-'));
             $('.team-2 .pr7').text(($skor.a7 ? $skor.a7:'-'));

	    if(data.turn==1 && data.turnvis==1)
	    {
             $('#team2ball').hide();
             $('#team1ball').show();
	    }else if(data.turn==2 && data.turnvis==1)
	    {
             $('#team1ball').hide();
             $('#team2ball').show();
	    }else{
             $('#team1ball').hide();
             $('#team2ball').hide();
	    }


	     }

	     if($skor.spid=="4")
	     {
             $skor.h = data.sch;
             $skor.h1 = data.isch;
             $skor.h2 = data.sch;
             $skor.a = data.sca;
             $skor.a1 = data.isca;
             $skor.a2 = data.sca;
             $skor.ych = data.ycardh;
             $skor.yca = data.ycarda;
             $skor.rch = data.redh;
             $skor.rca = data.reda;
             $skor.crnh = data.crnh;
             $skor.crna = data.crna;
             $skor.pnlth = data.pnlth;
             $skor.pnlta = data.pnlta;
             this.SetSoccerBoard($skor.h1, $skor.h2, $skor.crnh, $skor.ych, $skor.rch, $skor.pnlth, $skor.a1, $skor.a2, $skor.crna, $skor.yca, $skor.rca, $skor.pnlta);
             $skor.diff = Live.Difference(data.tvisible, data.run, parseInt(data.secound), data.referedate);             
	     $skor.running = data.run;
             $skor.tvis = parseInt(data.tvisible);
             $skor.pid = parseInt(data.pid);
             if (typeof $skor.pid == 'undefined') {
                 $skor.pid = 0;
             }
             $('#homeScore').text($skor.h);
             $('#awayScore').text($skor.a);
             var periyod = Live.GetPeriyod($skor.spid, $skor.pid);
             $('#periodComment').text(periyod);
             var minute = Live.FixTime($skor.diff+7);
             if (!$skor.running) {
                 minute = minute.replace(':', '.');
             }
             $('#time').text(minute);
             if (this.pid < 0) {
                 this.pid = $skor.pid;
             }
             if (this.pid != $skor.pid) {
                 this.pid = $skor.pid;
                 Live.DudukCal();
             }
             if ($skor.pid == 255) {
                 this.Stop();
             }
	     }
	     if($skor.spid=="7")
	     {
             $skor.pid = parseInt(data.pid);
             var periyod = Live.GetPeriyod($skor.spid, $skor.pid);
             $('#periodComment').text(periyod);
	     }

	     if($skor.spid=="7")
	     {
             $skor.h = parseInt(data.sch);
             $skor.h1 = parseInt(data.periodsh[1]);
             $skor.h2 = parseInt(data.periodsh[2]);
             $skor.h3 = parseInt(data.periodsh[3]);
             $skor.h4 = parseInt(data.periodsh[4]);
             $skor.h5 = parseInt(data.periodsh[5]);
             $skor.a = parseInt(data.sca);
             $skor.a1 = parseInt(data.periodsa[1]);
             $skor.a2 = parseInt(data.periodsa[2]);
             $skor.a3 = parseInt(data.periodsa[3]);
             $skor.a4 = parseInt(data.periodsa[4]);
             $skor.a5 = parseInt(data.periodsa[5]);
             $skor.htwo = parseInt($skor.h1+$skor.h2);
             $skor.htre = 0;
             $skor.atwo = parseInt($skor.a1+$skor.a2);
             $skor.atre = 0;
             this.SetSoccerBoardBasket($skor.h1, $skor.h2, $skor.h3, $skor.h4, $skor.a1, $skor.a2, $skor.a3, $skor.a4, $skor.htwo, $skor.htre, $skor.atwo, $skor.atre);
  	     if(data.pid>0) {
	     $skor.diff = data.dk;             
	     $skor.running = data.run;
             $skor.tvis = data.tvisible;
             $skor.pid = parseInt(data.pid);
	     }else{
	     $skor.diff = 0;             
	     $skor.running = 0;
             $skor.tvis = 0;
             $skor.pid = 0;
	     }
             if (typeof $skor.pid == 'undefined') {
                 $skor.pid = 0;
             }
             var oldscoreshome = Live.bets[$skor.eid].sch;
             var oldscoresaway = Live.bets[$skor.eid].sca;
             $('#homeScore').text($skor.h);
             $('#awayScore').text($skor.a);
             var periyod = Live.GetPeriyod($skor.spid, $skor.pid);
             $('#periodComment').text(periyod);
             var minute = '< '+parseInt($skor.diff)+' \'';
             if (!$skor.running) {
                 minute = minute.replace(':', '.');
             }
	     $('#time').text(minute);
            if (this.pid < 0) {
                 this.pid = $skor.pid;
             }
             if (this.pid != $skor.pid) {
                 this.pid = $skor.pid;
                 Live.DudukCal();
             }
             if ($skor.pid == 255) {
                 this.Stop();
             }
	     }
         },
         CloseOdds: function() {
             jQuery.each(this.oyunlar, function(i, r) {
                 r.statu = 0;
             });
         },
         OddsArrow: function(oranid, oran) {
             var arrow = "";
             if (this.eskioranlar[oranid]) {
                 if (oran < this.eskioranlar[oranid]) {
                     arrow = 'down';
                 }
                 if (oran > this.eskioranlar[oranid]) {
                     arrow = 'up';
                 }
             }
             this.eskioranlar[oranid] = oran;
             return arrow;
         },
		 OddsArrows: function(eid, oid,rid,or) {
         var arrows = "";
	     if(!Live.maingamearrow[eid]){ return "alfree"; }
	     if(!Live.maingamearrow[eid][oid]){ return "closed"; }
	     if(!Live.maingamearrow[eid][oid].oranlar[rid]){ return "closed"; }
		 if(parseFloat(Live.maingamearrow[eid][oid].oranlar[rid].oran) > parseFloat(or)){ return "down"; }
		 if(parseFloat(Live.maingamearrow[eid][oid].oranlar[rid].oran) < parseFloat(or)){ return 'up'; }
         },
         Template: {
             CreateTemplate: function(bahisler, oyunlar) {
                 var playing = false;
                 this.Header();
                 for (var i in Live.Details.sorter) {
                     if (Live.idcol[i]) {
				var gis = Live.Details.oyunlar[Live.Details.sorter[i]].gid;
				if(Live.Details.grupid==99)
				{
				if(bahisler.tgol<1 && (Live.Details.oyunlar[Live.Details.sorter[i]].gid=="30" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="31" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32"))
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
				if(bahisler.tgol<2 && (Live.Details.oyunlar[Live.Details.sorter[i]].gid=="31" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32"))
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
				if(bahisler.tgol<3 && Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32")
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
                         	if (Live.livefavs[gis]) {
				if(bahisler.tgol<1 && (Live.Details.oyunlar[Live.Details.sorter[i]].gid=="30" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="31" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32"))
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
				if(bahisler.tgol<2 && (Live.Details.oyunlar[Live.Details.sorter[i]].gid=="31" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32"))
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
				if(bahisler.tgol<3 && Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32")
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
                             	if (!Live.Details.oyunlar[Live.Details.sorter[i]].statu) {
                                 Live.Details.Template.Suspended(Live.Details.oyunlar[Live.Details.sorter[i]].oyunad);
                             	} else {
                                 Live.Details.Template.SetOdds(bahisler, Live.Details.oyunlar[Live.Details.sorter[i]]);
                             	}
                             	playing = true;
				}
				}
                         if (Live.idcol[i].grup[Live.Details.grupid]) {
				if(bahisler.tgol<1 && (Live.Details.oyunlar[Live.Details.sorter[i]].gid=="30" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="31" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32"))
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
				if(bahisler.tgol<2 && (Live.Details.oyunlar[Live.Details.sorter[i]].gid=="31" || Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32"))
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}
				if(bahisler.tgol<3 && Live.Details.oyunlar[Live.Details.sorter[i]].gid=="32")
				{
				Live.Details.oyunlar[Live.Details.sorter[i]].statu=false;
				}



                             if (!Live.Details.oyunlar[Live.Details.sorter[i]].statu) {
                                 Live.Details.Template.Suspended(Live.Details.oyunlar[Live.Details.sorter[i]].oyunad);
                             } else {
                                 Live.Details.Template.SetOdds(bahisler, Live.Details.oyunlar[Live.Details.sorter[i]]);
                             }
                             playing = true;
                         }
                     }
                 }
                 this.Footer();
                 jQuery('#mainBet').html(html);
				 kuponguncelle();
                 $('#LiveContentDetails').show();
                 if (!playing) {
                     this.Debug('Bahis oranları kapatıldı ya da oranlar güncelleniyor');
                 } else {
                     this.Debug('');
                 }
                 this.SetToggle();
             },
             Header: function() {
                 html = '<div class="new_filtr_div bg3" style="width: 745px;display: block;float: left;margin: 6px;height: 33px;background: #ebebeb;border: 1px solid #ccc;line-height: 25px;"><a class="new_filtr_item" href="javascript:Live.Details.Filter(1);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 1 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2 ">Tüm Bahisler</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item" href="javascript:Live.Details.Filter(2);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 2 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2">Alt/Üst</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item" href="javascript:Live.Details.Filter(3);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 3 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2">Skor Bahisleri</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item" href="javascript:Live.Details.Filter(4);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 4 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2">1. Yarı</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item" href="javascript:Live.Details.Filter(5);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 5 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2">2. Yarı</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item" href="javascript:Live.Details.Filter(6);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 6 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2">Gol Bahisleri</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item" href="javascript:Live.Details.Filter(7);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 7 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2">Evsahibi</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item" href="javascript:Live.Details.Filter(8);"><span class="new_filtr_item1"></span><span style="display: inline-block;margin-bottom: 0;font-size: 14px;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;user-select: none;background-image: none;border-radius: 0;color: #fff;line-height: 26px;padding: 0 10px;border: none;float: left;margin-right: 5px;margin-left: 5px;margin-top: 3px;background: ' + (Live.Details.grupid == 8 ? '#f74835;' : '#323232;') + '" class="new_filtr_item2">Deplasman</span><span class="new_filtr_item3"></span><span class="clear"></span></a></div><div class="match-detail-groups"><div class="ot-group">';
             },
             Footer: function() {
                 html += '</div></div>';
             },
             FilterTable: function() {
                 html += '<div class="new_filtr_div bg3"><a class="new_filtr_item  ' + (Live.Details.grupid == 99 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(99);"><span class="new_filtr_item1"></span><span class="new_filtr_item2 ">Favoriler</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item  ' + (Live.Details.grupid == 1 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(1);"><span class="new_filtr_item1"></span><span class="new_filtr_item2 ">Hepsi</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item ' + (Live.Details.grupid == 2 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(2);"><span class="new_filtr_item1"></span><span class="new_filtr_item2">Alt/Üst</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item ' + (Live.Details.grupid == 3 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(3);"><span class="new_filtr_item1"></span><span class="new_filtr_item2">Skor</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item ' + (Live.Details.grupid == 4 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(4);"><span class="new_filtr_item1"></span><span class="new_filtr_item2">1. Yarı</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item ' + (Live.Details.grupid == 5 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(5);"><span class="new_filtr_item1"></span><span class="new_filtr_item2">2. Yarı</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item ' + (Live.Details.grupid == 6 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(6);"><span class="new_filtr_item1"></span><span class="new_filtr_item2">Gol</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item ' + (Live.Details.grupid == 7 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(7);"><span class="new_filtr_item1"></span><span class="new_filtr_item2">Evsahibi</span><span class="new_filtr_item3"></span><span class="clear"></span></a><a class="new_filtr_item ' + (Live.Details.grupid == 8 ? 'active' : ' ') + '" href="javascript:Live.Details.Filter(8);"><span class="new_filtr_item1"></span><span class="new_filtr_item2">Deplasman</span><span class="new_filtr_item3"></span><span class="clear"></span></a></div>';
             },
             Debug: function(text) {
                 jQuery('#debug').text(text);
             },
             SetOdds: function(k, l) {
                 if (l.count == 1) {
                     sutun = 1;
                 } else if (l.count % 2 == 0) {
                     sutun = 2;
                 } else if (l.count % 3 == 0) {
                     sutun = 3;
                 } else {
                     sutun = 3;
                 }
                 var tr = 1;
                 var image = "";
                 html += '<div class="match-market cf ng-scope"><div class="left market-name"><span class="ng-binding" id="coranim">'+l.oyunad.toUpperCase()+'<b class="ng-binding"></b></span><span class="info_but" style="float: right;margin-top: 4px;"><span class="bubble b_left top16 b_shad ng-binding"></span></span></div><div class="right cf" ' + (sutun > 3 ? 'style="width:745px;"' : ' ') + '><div class="cf"><div class="cf ng-scope">';
                 //html += '<div class="right cf"  ><div class="cf"><div class="cf ng-scope">';
                 jQuery.each(l.oranlar, function(a, b) {
                     //if (tr == 1) html += '<tr>';
                     image = Live.Details.OddsArrow(b.brid, b.oran);
		     if(b.oran>1)
		     {
                     Live.Details.Template.SetTd(l.oyunad, b.oran, b.tercih, k.spid, image);
		     }else{
                     Live.Details.Template.SetTdsus(b.tercih);
		     }
                     tr++;
                     if (tr > sutun) {
                         //html += '</tr>';
                         tr = 1;
                     }
                 });
                 html += '</div></div></div></div>';
             },
             SetTd: function(tahminadi, oran, tercih, oyunspid, image) {
                 var tercih_ver ='';
				 if(tercih=="1 Gol"){
					tercih_ver = "1";
				 } else if(tercih=="2 Gol"){
					tercih_ver = "2";
				 } else if(tercih=="3 Gol"){
					tercih_ver = "3";
				 } else if(tercih=="4 Gol"){
					tercih_ver = "4";
				 } else if(tercih=="5 Gol"){
					tercih_ver = "5";
				 } else if(tercih=="6 Gol"){
					tercih_ver = "6";
				 } else if(tercih=="7 Gol"){
					tercih_ver = "7";
				 } else {
					tercih_ver = tercih;
				 }
				 
				 var qbut = CryptoJS.MD5(tahminadi+"|"+tercih+"|"+Live.Details.eventid);
				 
				 html += '<div class="odds-cell ng-scope" style="width: 95px;' + (Live.GameTranslate(tercih) == '3 veya üstü' ? 'width:100px;' : ' ') + '' + (Live.GameTranslate(tercih) == '4 veya üstü' ? 'width:100px;' : ' ') + '' + (Live.GameTranslate(tercih) == '5 veya üstü' ? 'width:100px;' : ' ') + '' + (Live.GameTranslate(tercih) == '6 veya üstü' ? 'width:100px;' : ' ') + '' + (Live.GameTranslate(tercih) == '7 veya üstü' ? 'width:100px;' : ' ') + '' + (Live.GameTranslate(tercih) == '8 veya üstü' ? 'width:100px;' : ' ') + '' + (Live.GameTranslate(tercih) == '1 Gol' ? 'width:77px;' : ' ') + '' + (Live.GameTranslate(tercih) == '2 Gol' ? 'width:77px;' : ' ') + '' + (Live.GameTranslate(tercih) == '3 Gol' ? 'width:77px;' : ' ') + '' + (Live.GameTranslate(tercih) == '4 Gol' ? 'width:77px;' : ' ') + '' + (Live.GameTranslate(tercih) == '5 Gol' ? 'width:77px;' : ' ') + '' + (Live.GameTranslate(tercih) == '6 Gol' ? 'width:77px;' : ' ') + '' + (Live.GameTranslate(tercih) == '7 Gol' ? 'width:77px;' : ' ') + '"><div class="odds-cell-inline ng-scope"><span class="odd-label ng-binding" style="margin-top: 6px;width: 54px;' + (Live.GameTranslate(tercih) == '3 veya üstü' ? 'width:60px;' : ' ') + '' + (Live.GameTranslate(tercih) == '4 veya üstü' ? 'width:60px;' : ' ') + '' + (Live.GameTranslate(tercih) == '5 veya üstü' ? 'width:60px;' : ' ') + '' + (Live.GameTranslate(tercih) == '6 veya üstü' ? 'width:60px;' : ' ') + '' + (Live.GameTranslate(tercih) == '7 veya üstü' ? 'width:60px;' : ' ') + '' + (Live.GameTranslate(tercih) == '8 veya üstü' ? 'width:60px;' : ' ') + '' + (Live.GameTranslate(tercih) == '1 Gol' ? 'width:30px;' : ' ') + '' + (Live.GameTranslate(tercih) == '2 Gol' ? 'width:30px;' : ' ') + '' + (Live.GameTranslate(tercih) == '3 Gol' ? 'width:30px;' : ' ') + '' + (Live.GameTranslate(tercih) == '4 Gol' ? 'width:30px;' : ' ') + '' + (Live.GameTranslate(tercih) == '5 Gol' ? 'width:30px;' : ' ') + '' + (Live.GameTranslate(tercih) == '6 Gol' ? 'width:30px;' : ' ') + '' + (Live.GameTranslate(tercih) == '7 Gol' ? 'width:30px;' : ' ') + '">' + Live.GameTranslate(tercih_ver) + '</span><a id="'+qbut+'" href="javascript:;" style="" class="qbut '+image+'" onclick="canliekle(\''+tahminadi+'\',\''+tercih+'\',\''+oran+'\',\''+Live.Details.eventid+'\',\''+oyunspid+'\')" onmouseover="" onmouseout="">' + oran + '</a></div></div>';
             },
             SetTdsus: function(tercih) {
                 html += '<div class="odds-cell ng-scope" style=""><div class="odds-cell-inline ng-scope"><span class="odd-label ng-binding" style=" ">' + Live.GameTranslate(tercih) + '</span><a href="javascript:;" style="" class="btn-odd locked" onmouseover="" onmouseout="">1.00</a></div></div>';
             },
             Suspended: function(oyunad) {
                 html += '<div class="match-market cf ng-scope"><div class="left market-name"><span class="ng-binding" id="coranim">'+oyunad+'<b class="ng-binding"></b></span><span class="info_but" style="float: right;margin-top: 4px;"><span class="bubble b_left top16 b_shad ng-binding"></span></span></div><div class="right cf"><div class="cf"><div class="cf ng-scope">';
                 html += '</div></div></div></div>';
             },
             SetToggle: function() {
                 for (var v in Live.Details.kapatilanlar) {
                     jQuery('#mainBets_' + v).hide();
                 }
             },
             Toggle: function(divid) {
                 jQuery('#mainBets_' + divid).toggle();
                 if (Live.Details.kapatilanlar[divid]) {
                     delete Live.Details.kapatilanlar[divid];
                 } else {
                     Live.Details.kapatilanlar[divid] = divid;
                 }
             }
         }
     }
 };