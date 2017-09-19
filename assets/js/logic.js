/*

ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A
data.gov authentication key

Query to select ethnicity for schools - i've kept year 2014, we can change year
https://api.data.gov/ed/collegescorecard/v1/schools?fields=
school.name,
id,
2014.student.demographics.race_ethnicity.white,
2014.student.demographics.race_ethnicity.black,
2014.student.demographics.race_ethnicity.hispanic,
2014.student.demographics.race_ethnicity.asian,
2014.student.demographics.race_ethnicity.aian,
2014.student.demographics.race_ethnicity.nhpi,
2014.student.demographics.race_ethnicity.two_or_more,
2014.student.demographics.race_ethnicity.non_resident_alien,
2014.student.demographics.race_ethnicity.unknown,
2014.student.demographics.race_ethnicity.white_non_hispanic,
2014.student.demographics.race_ethnicity.black_non_hispanic,
2014.student.demographics.race_ethnicity.asian_pacific_islander&
sort=2014.completion.rate_suppressed.overall:desc&
api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&
school.name=new+york


//the whole school object --- lot of data
https://api.data.gov/ed/collegescorecard/v1/schools?id=164924&
api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A


// student financial data - not sure how I want to use it, at this point just ignore
https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,2012.aid.median_debt.completers.overall,2012.repayment.1_yr_repayment.completers,2012.earnings.10_yrs_after_entry.working_not_enrolled.mean_earnings&
page=100&
api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A

// my primary focus - gets overall sat score for school
https://api.data.gov/ed/collegescorecard/v1/schools.json?school.degrees_awarded.predominant=2,3&
_fields=id,school.name,2013.student.size,
2013.admissions.sat_scores.average.overall
&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&
school.name=university+texas

The result fetches metadata and result array. Metadata says how many total results. by default  always page 0
you can add page count as part of query
*/

//******************************************/
//**************  FUNCTIONS  ***************/
//******************************************/

function fetchData(event) {

    //Clear Table
    //$('#clienti').bootstrapTable('removeAll');

    console.log("fetchData() Called")
    event.preventDefault();

    //getting value from index.html to filter results 
    var schoolName = $("#school").val().trim();
    var satScore = $("#sat").val().trim();
    var tuition = $("#tuition").val().trim();
    var degree = $("#degree").val().trim();
    var flag = true;
    degree = degree.toLowerCase();

    if (degree == "select degree") {
        degree = "";
    }
    if (schoolName.length < 1 && satScore.length < 1 && tuition.length < 1 && degree.length < 1) {
        console.log("no input data");
        flag = false;
    }

    //replacing spaces with + to make it query ready
    schoolName = schoolName.replace(' ', '+');

    console.log("inputs :", schoolName, satScore, tuition, degree);

    //Clear Field
    $('#school').val('');

    //Query to fetch filtered data
    var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?" +
        "school.degrees_awarded.predominant=2,3&" +
        "_fields=id," +
        "school.name," +
        "2014.student.size," +
        "2014.admissions.sat_scores.average.overall&" +
        "api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A";

    // checking each filter's value to be not null before adding it to query filter for API
    if (schoolName.length > 1) {
        query = query + "&school.name=" + schoolName;
    }
    if (satScore.length > 2) {
        query = query + "&2014.admissions.sat_scores.average.overall__range=700.."
            + satScore;
    }
    if (tuition.length > 1) {
        query = query + "&2014.cost.avg_net_price.overall__range=2000.." + tuition;
    }
    if (degree.length > 1) {
        query = query + "&2014.academics.program.bachelors."
            + degree + "=1";
    }

    //   console.log("Query " + query);
    $.ajax({
        url: query,
        method: 'GET',
    }).done(function (result) {
        displayData(result);
    });// end of Ajax call
} // fetchData()

function displayData(result) {

    /* result.results[0]["2013.admissions.sat_scores.average.overall"]  */
    console.log("result.results.length", result.results.length);

    //Clearing Table
    $('#clienti').bootstrapTable('removeAll');

    var mydata2 = [];
    for (i = 0; i < result.results.length; i++) {
        var name = result.results[i]["school.name"]
        var sat = result.results[i]["2014.admissions.sat_scores.average.overall"];
        var studentSize = result.results[i]["2014.student.size"]
        var id = result.results[i]["id"]
        var tmp = [
            {
                "school.name": "" + name,
                "id": "" + id,
                "2014.student.size": "" + studentSize,
                "2014.admissions.sat_scores.average.overall": "" + sat
            }
        ];
        mydata2.push.apply(mydata2, tmp);
    }
    console.log("mydata2", mydata2);

    $('#clienti').bootstrapTable({
        data: mydata2
    });

    //Refresh Data by Appending it
    $('#clienti').bootstrapTable('append', mydata2);

    //Add Row Click Event to Table
    $('#clienti').on('click-cell.bs.table', function (field, value, row, $el) {
        if (value != "type") {
            // alert($el.id+"-"+$el.name+"-"+$el.type);
            // alert("Selected Row's ID: '" + $el.id + "'")

            $(".main").css("display", "none");
            $(".chart-body").show();
            DisplayGraphs($el.id);
        }
    });
} //displayData()


$(document).ready(function () {

    //*******************************************/
    //****************  EVENTS  *****************/
    //*******************************************/

    //Input Form Submit Button calls fetchData() Function
    jQuery("form").submit(fetchData);

}) ///$(document).ready(function() {
