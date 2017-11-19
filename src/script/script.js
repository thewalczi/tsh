$(function() {

var rating;

$.ajax({
    type: 'GET',
    url: 'http://test-api.kuria.tshdev.io/',
    dataType: 'json',
    success: function(data) {

        var rateArr = [];

        for (var i = 0; i < data.payments.length; i++) {

            rating = parseInt(data.payments[i].payment_cost_rating);

            rateArr.push(rating);

            $('#content table').append(
                '<tr><td class="supplier">' + data.payments[i].payment_supplier + '</td><td 	class="rating"><span>&#163;</span><span>&#163;</span><span>&#163;</span><span>&#163;</span><span>&#163;</span></td><td class="ref">' + data.payments[i].payment_ref + '</td><td class="value"> &#163;' + data.payments[i].payment_amount + '</td></tr>'
            );

        }


        setTimeout(function() {

            $('tr:even').each(function() {
                $(this).addClass('even-row');
            });

            for (var i = 0; i < rateArr.length; i++) {
                for (var j = 0; j < rateArr[i]; j++) {
                    $('.rating').eq(i).find('span').eq(j).addClass('rated');
                }
            }


        }, 100);
    }

});


});
