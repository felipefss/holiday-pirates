'use strict';

String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
};

function loadReviews(id, index) {
    $('#collapse' + index).empty();

    $.get('http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id=' + id, function(data, status) {
        for (var i = 0; i < data.length; i++) {
            var well = document.createElement('div');
            well.className = 'well well-lg';
            well.style.margin = '0';

            var rating = data[i].positive ? '<div class="col-md-1"><i class="fa fa-plus-square fa-3x"></i></div>' :
                '<div class="col-md-1"><i class="fa fa-minus-square fa-3x"></i></div>';

            var comment = '<div class="col-md-10"><h4><span class="label label-primary">' + data[i].name + '</span></h4>';
            comment += '<p>' + data[i].comment + '</p></div>';

            $(well).append(rating);
            $(well).append(comment);
            $(well).append('<div class="clearfix"></div>');
            $('#collapse' + index).append(well);
        }
    });
}

function loadHotels() {
    $.ajax({
        url: 'http://fake-hotel-api.herokuapp.com/api/hotels?count=5',
        error: function(xhr, status, error) {
            var showError = document.createElement('div');
            showError.className = 'well';
            var text = '<p>' + error + '</p>';

            $(showError).html(text);
            $('.content').html(showError);
        },
        success: function(result, status, xhr) {
            $('.content').empty();

            for (var i = 0; i < result.length; i++) {
                var panel = document.createElement('div');
                panel.className = 'panel panel-default';
                panel.style.margin = '20px';

                var imgDiv = document.createElement('div');
                imgDiv.className = 'col-md-4';
                imgDiv.style.width = '33%';

                var img = '<div id="carousel' + i + '" class="carousel slide" data-ride="carousel">';
                img += '<div class="carousel-inner" role="listbox">';
                img += '<div class="item active">';
                img += '<img class="img-responsive" src="' + result[i].images[0] + '"></div>';

                if (result[i].images.length > 1) {
                    for (var j = 1; j < result[i].images.length; j++) {
                        img += '<div class="item">';
                        img += '<img class="img-responsive" src="' + result[i].images[j] + '">';
                        img += '</div>';
                    }
                    img += '</div> <!-- /.carousel-inner -->';
                    img += '<a class="left carousel-control" href="#carousel' + i + '" role="button" data-slide="prev">';
                    img += '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>';
                    img += '<span class="sr-only">Previous</span></a>';

                    img += '<a class="right carousel-control" href="#carousel' + i + '" role="button" data-slide="next">';
                    img += '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
                    img += '<span class="sr-only">Next</span></a>';
                    img += '</div> <!-- /#carousel -->';
                }

                $(imgDiv).append(img);
                $(panel).append(imgDiv);

                var info = '<div class="col-md-8" style="padding: 10px;">';
                info += '<div style="float: right !important;">';
                info += '<div>';

                var fullStars = '<i class="fa fa-star"></i>';
                info += fullStars.repeat(result[i].stars);

                var emptyStars = '<i class="fa fa-star-o"></i>';
                info += emptyStars.repeat(5 - result[i].stars);

                info += '</div></div> <!-- /style=float: right -->';

                var name = '<h3>' + result[i].name + '</h3>';
                name += result[i].city + ' - ' + result[i].country + '<br><br>';

                //Append to info
                info += name;

                //Append to info
                info += '<strong>Description:</strong> ' + result[i].description;

                var date_start = new Date(Date.parse(result[i].date_start));
                var date_end = new Date(Date.parse(result[i].date_end));

                var price = '<div style="float: right !important;">' +
                    '<h2>' + result[i].price + ' €</h2>';
                price += date_start.getDate() + '.' +
                         date_start.getMonth() + '.' +
                         date_start.getFullYear() + ' - ' +
                         date_end.getDate() + '.' +
                         date_end.getMonth() + '.' +
                        date_end.getFullYear();

                price += '</div><br><br>';

                //Append to info
                info += price;

                var reviewBtn = '<div><button type="button" class="btn btn-primary" ';
                reviewBtn += 'data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="false" ';
                reviewBtn += 'aria-controls="collapse' + i + '" ';
                reviewBtn += 'onclick="loadReviews(\'' + result[i].id + '\', ' + i + ')">Show reviews</button></div>';

                //Append to info
                info += reviewBtn + '</div> <!-- /.col-md-8 -->';
                info+= '<div class="clearfix"></div>';

                var collapse = document.createElement('div');
                collapse.className = 'collapse';
                collapse.id = 'collapse' + i;
                
                $(panel).append(info);
                $(panel).append(collapse);
                $('.content').append(panel);
            }
        }
    });
}