class LearningController {

    constructor() {
        this.filterDataArray = [];
    }

    updateActiveClass() {
        // tab 
        $('.tab-btn-wrapper .tab-btn').removeClass('active');
        $('.tab-btn-wrapper input[name="tab-btn"]:checked').closest('.tab-btn').addClass('active');

        // sidebar filter
        $('#filter-links-wrapper .filter-item-li').removeClass('active-li')
        $('#filter-links-wrapper input[name="side-fiter-radio"]:checked').closest('.filter-item-li').addClass('active-li');
    }

    filteredTabData(checkedRadio) {
        // console.log(checkedRadio)
        let $allTabContents = $('.tab-content')
        $allTabContents.each((index, tabContent) => $(tabContent).css("display", "none").addClass('unavailable'))
        $allTabContents.each((index, tabContent) => {
            if (!checkedRadio) {
                $(tabContent).css("display", "block").removeClass('unavailable')
                $('.filter-btn').addClass('uk-hidden')
            } else if (checkedRadio === $(tabContent).data('tab-content')) {
                $(tabContent).css("display", "block").removeClass('unavailable')
                $('.filter-btn').removeClass('uk-hidden')
            }
        })
    }

    filteredSidebarData(selectedRadio) {

        let $allTabContents = $('.tab-content')
        let dataArray = [];
        $allTabContents.each((index, content) => {
            if (!$(content).hasClass('unavailable')) {

                $(content).each((index, content) => $(content).css("display", "none"))

                if ($(content).data('text').includes(selectedRadio)) {
                    $(content).css("display", "block")
                }

            }
        })

    }

    renderSidebarFilter(filterData, selectedTabBtn) {
        $('#filter-links-wrapper').html('')


        let word = selectedTabBtn.split('-')[0];
        $('#filter-links-wrapper').append(`
            <li class="title">
                <span>${word}</span>
            </li>
        `)
        let uniqueFilterData = [...new Set(filterData)]
        for (const [index, data] of uniqueFilterData.entries()) {
            $('#filter-links-wrapper').append(`
                <li class="filter-item-li">
                    <input type="radio" name="side-fiter-radio" id="${selectedTabBtn}-${index}" value="${data}"/>
                    <label for="${selectedTabBtn}-${index}">${data}</label>
                </li>
            `)
        }
    }

    mangeSidebarFilterData() {
        this.filterDataArray = [];
        let $allTabContents = $('.tab-content')
        $allTabContents.each((index, content) => {
            if (!$(content).hasClass('unavailable')) {
                let textContent = $(content).data('text').replace(/,\s+/g, ',')

                if (textContent.includes(',')) {
                    const selectedRadioArray = textContent.split(',');

                    selectedRadioArray.forEach((each) => {
                        this.filterDataArray.push(each)
                    })
                } else {
                    this.filterDataArray.push(textContent)
                }
            }
        })

    }

}

const learningController = new LearningController()
$(document).ready(function () {

    let $checkedRadio = $('.tab-btn-wrapper input[name="tab-btn"]:checked').val();
    learningController.filteredTabData($checkedRadio)
    learningController.updateActiveClass()

    // *******************
    // ----- actions -----
    // *******************

    // change tabs
    $(document).on('change', '[name="tab-btn"]', function () {
        let $selectedTabBtn = $(this).val()

        learningController.filteredTabData($selectedTabBtn)
        learningController.updateActiveClass()
        learningController.mangeSidebarFilterData()
        learningController.renderSidebarFilter(learningController.filterDataArray, $selectedTabBtn)
    })



    // change sidebar filter
    let selectedSideFilter;
    $(document).on('change', '[name="side-fiter-radio"]', function () {
        let selectedSideFilter = $(this).val();

        learningController.filteredSidebarData(selectedSideFilter)
        learningController.updateActiveClass()
    })


    let lastChecked = null;
    $(document).on('click', '#filter-links-wrapper .filter-item-li input', function () {

        if (this === lastChecked) {
            $(this).prop('checked', false);
            lastChecked = null; // Reset the last checked

            $(this).closest('.filter-item-li').removeClass('active-li')

            if ($('#filter-links-wrapper .title span').text().toLowerCase() === 'core') {
                learningController.filteredTabData("core-data")
            } else if ($('#filter-links-wrapper .title span').text().toLowerCase() === 'elective') {
                learningController.filteredTabData("elective-data")
            }
        } else {
            // Otherwise, set the lastChecked to this one
            $(this).closest('.filter-item-li').addClass('active-li')

            lastChecked = this;
            console.log("checked");
            learningController.filteredSidebarData($(this).val())
        }
    })




})