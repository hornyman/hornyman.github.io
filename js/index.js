
function inIframe () { try { return window.self !== window.top; } catch (e) { return true; } }



var currentQuotes = []
var currentQuote = '', currentAuthor = '';
function openURL(url){
  window.open(url, 'Share', 'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0');
}

function findIndex(min, max) {
  rand = Math.floor(Math.random() * (max - min)) + min;
  if (currentQuotes.indexOf(rand) == -1) {
    if (currentQuotes.length < 3) {
      currentQuotes.push(rand);
      return rand;
    } else {
      currentQuotes.splice(0, 1);
      currentQuotes.push(rand);
      return rand;
    }
  }
}

function getQuote() {

  $.ajax('/quotes.json', {
  type: 'GET',
  dataType: 'text',
  contentType: "application/json",
  success: function(response) {
    jsonString = response;
    obj = JSON.parse(jsonString);
    length = obj.length
    min = Math.ceil(0);
    max = Math.floor(length);
    rand = findIndex(min, max);



    currentQuote = obj[rand].quote
    currentAuthor = obj[rand].author
    return

    }
  });

  if(inIframe())
  {
    $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" -' + currentAuthor));
  }
  $(".quote-text").animate({
      opacity: 0
    }, 500,
    function() {
      $(this).animate({
        opacity: 1
      }, 500);
      $('#text').text(currentQuote);
    });

  $(".quote-author").animate({
      opacity: 0
    }, 500,
    function() {
      $(this).animate({
        opacity: 1
      }, 500);
      $('#author').html(currentAuthor + "  ");
    });
}
$(document).ready(function() {
  getQuote();
  $('#new-quote').on('click', getQuote);
  $('#tweet-quote').on('click', function() {
    if(!inIframe()) {
      openURL('https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + currentQuote + '" ' + currentAuthor));
    }
  });
  $('#tumblr-quote').on('click', function() {
    if(!inIframe()) {
      openURL('https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='+encodeURIComponent(currentAuthor)+'&content=' + encodeURIComponent(currentQuote)+'&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button');
    }
  });
});
