hljs.initHighlightingOnLoad();
$('.love').click(function () {
  $('.love i').addClass('fa-thumbs-up')
  $.get("/apis/loveArtilce", {
    id: $('.info').attr("id")
  });
})