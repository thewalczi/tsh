$(function() {

// FUNCTIONS


function pagination(data) {

    Object.keys(data.pagination.links).forEach(function(pagination) {
        var paginationNum = parseInt(pagination) + 1;
        $('#pagination ul').append('<li><button data-page=' + pagination + '>' + paginationNum + '</button></li>');
    });
    $('#pagination li').first().addClass('first-page');
    $('#pagination li').last().addClass('last-page');

    var currPage = parseInt(data.pagination.current);

    $('#pagination button').each(function() {
        if ($(this).attr('data-page') == currPage) {
            $(this).addClass('current');
        }
    });
}

function endPage() {

    if ($('.last-page').prev().find('button').attr('data-page') < $('.last-page').find('button').attr('data-page') - 1) {
        $('.last-page button').html('>');
    }

    if ($('.first-page').next().find('button').attr('data-page') >= 2) {
        $('.first-page button').html('<');
    }
}

function render(data) {
    data.payments.forEach(function(payment) {

        var amount = parseFloat(payment.payment_amount);
        var amountNum = amount.toLocaleString('en-IN');
        $('#content table tbody').append('\
            <tr>\
                <td class="supplier">' + payment.payment_supplier + '</td>\
                <td class="rating"><span>&#163;</span><span>&#163;</span><span>&#163;</span><span>&#163;</span><span>&#163;</span><span class="mobile-rating rated">' + payment.payment_cost_rating + '</span></td>\
                <td class="ref">' + payment.payment_ref + '</td>\
                <td class="value"> &#163;' + amountNum + '</td>\
            </tr>'
        );
    });
    $('#content tbody tr:odd').addClass('odd-row');
}

function rating(data) {
    var rateArr = [];
    for (var i = 0; i < data.payments.length; i++) {
        var rating = parseInt(data.payments[i].payment_cost_rating);
        rateArr.push(rating);
    }
    for (var i = 0; i < rateArr.length; i++) {
        for (var j = 0; j < rateArr[i]; j++) {
            $('tbody .rating').eq(i).find('span').eq(j).addClass('rated');
        }
    }
}

var currUrl;


/* RENDER PAGE  */

$.ajax({
    type: 'GET',
    url: 'http://test-api.kuria.tshdev.io/',
    dataType: 'json',
    success: function(data) {

        currUrl = this.url;

        pagination(data);
        render(data);
        rating(data);

        setTimeout(function() {
            endPage();
        }, 0);



        /* UPDATE PAGE AFTER PAGE CHANGE */


        $('#page-content').on('click', '#pagination button', function() {


            var page = $(this).attr('data-page');

            $.ajax({
                type: 'GET',
                url: currUrl,
                dataType: 'json',
                data: {
                    page: page
                },
                success: function(data) {

                    $('#pagination ul').html('');
                    $('#content table tbody').html('');

                    currUrl = this.url;

                    pagination(data);
                    render(data);
                    rating(data);

                    setTimeout(function() {
                        endPage();
                    }, 0);
                }
            });
        });



        /* UPDATE PAGE AFTER SEARCH */

        $('#page-content').on('click', '#search-btn', function(event) {

            event.preventDefault();

            var supplier = $('#supplier-search').val();

            var rated = $('#rating-search input').val();

            $.ajax({
                type: "GET",
                url: currUrl,
                dataType: 'json',
                data: {
                    query: supplier,
                    rating: rated,
                    page: 0
                },
                success: function(data) {

                    $('#pagination ul').html('');
                    $('#content table tbody').html('');

                    currUrl = this.url;

                    pagination(data);
                    render(data);
                    rating(data);

                    setTimeout(function() {
                        endPage();
                    }, 0);
                }
            })
        });
    },
    error: function(data) {
        // alert('error');
    }
});



/* MODAL CLOSE */


$('body').on('click', '.close', function() {
    $('#modal-wrapper').animate({
        top: '7%'
    }, 100, function() {
        $('#shadow').fadeOut(300);
        $('#modal-wrapper').animate({
            top: '-50%',
            opacity: '0'
        }, 200, function() {
            $('#modal-wrapper').hide();
        });
    });
});


/* MODAL OPEN */

$('tbody').on('click', 'tr', function() {
    var getSupplier = $(this).find('.supplier').text();
    var getRef = $(this).find('.ref').text();
    var getValue = $(this).find('.value').text();
    var getRating = $(this).find('.rating').html();
    $('#modal-inner h4').text(getSupplier);
    $('#modal-ref p').text(getRef);
    $('#modal-value p').text(getValue);
    $('#modal-rating p').html(getRating);

    $('#shadow').fadeIn(100);
    $('#modal-wrapper').show().animate({
        opacity: '1',
        top: '7%'
    }, 300, function() {
        $('#modal-wrapper').animate({
            top: '5%',
        }, 100);
    });
});



});