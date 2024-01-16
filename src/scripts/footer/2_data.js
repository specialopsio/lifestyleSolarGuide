        // Function to extract 'id' query parameter from the URL
        function getCustomerIdFromUrl() {
            const queryParams = new URLSearchParams(window.location.search);
            return queryParams.get("id");
        }

        // Function to fetch data using the customer ID
        async function fetchData(customerId) {
            const url = `https://hook.us1.make.com/1lqfj9g8jrgqnkwodbt7ctn8uywfdiht?customerId=${customerId}`;

            try {
                const response = await fetch(url);
                const rawText = await response.text();
                const sanitizedText = sanitizeJSON(rawText);
                const data = JSON.parse(sanitizedText);

                updateHtmlWithData(data);
                displaySelectedAnswers(data.survey);
                updateDisplayAfterFetch();
                endData = data

                // Load and play videos based on survey response
                loadAndPlayVideos(data.survey);

                return data;
            } catch (error) {
                console.error("Error:", error);
                if(new URLSearchParams(window.location.search).get('id') === 'admin'){
                    updateDisplayAfterFetch();
                }
            }
        }

        function sanitizeJSON(rawText) {
            rawText = rawText
                .replace(/\[,/g, "[null,")
                .replace(/,\]/g, ",null]")
                .replace(/,,/g, ",null,")
                .replace(/[“”"]/g, '"')
                .replace(/\u00A0/g, ' ');
            rawText = rawText.replace(/:\s*,/g, ": null,");
            return rawText;
        }

        function safeRetrieve(obj, key) {
            return obj && obj[key] ? obj[key] : "";
        }

        function updateHtmlWithData(data) {
            if (!data) {
                console.error("Received null or invalid data");
                return;
            }

            for (let i = 1; i <= 4; i++) {
                const surveyElement = document.getElementById(`survey${i}`);
                if (surveyElement) {
                    surveyElement.textContent =
                        data.survey && data.survey.length >= i ? data.survey[i - 1] : "";
                }
            }

            document.getElementById("zip").textContent = safeRetrieve(data, "zip");
            document.getElementById("zip2").textContent = safeRetrieve(data, "zip");
            document.getElementById("zip3").textContent = safeRetrieve(data, "zip");
            updateRepresentativeInfo(data.rep || data.deal.rep || {});
        }

        function updateRepresentativeInfo(rep) {
            const repPhoneElement = document.getElementById("repPhone");
            const repEmailElement = document.getElementById("repEmail");
            const repContactElement = document.getElementById("repContact");
            const repPictureElement = document.getElementById("repPicture");

            document.getElementById("repName").textContent = safeRetrieve(rep, "name");
            document.getElementById("contactRepName").textContent = safeRetrieve(rep, "name");

            // Update phone
            if (rep.phone) {
                const formattedPhone = rep.phone.replace(/[ \(\)\-\+]/g, "");
                // repPhoneElement.textContent = rep.phone;
                repPhoneElement.href = `tel:${formattedPhone}`;
                repPhoneElement.style.display = "block";
            } else {
                repPhoneElement.style.display = "none";
                // document.getElementById("contactRepPhoneContainer").style.display = "none";
            }

            // Update email
            if (rep.email) {
                repEmailElement.href = `mailto:${rep.email}`;
                repEmailElement.style.display = "block";
                document.getElementById("contactRepEmail").textContent = rep.email;
            } else {
                repEmailElement.style.display = "none";
                document.getElementById("contactRepEmailContainer").style.display = "none";
            }

            // Update picture
            if (rep.picture) {
                repPictureElement.src = rep.picture;
                repPictureElement.style.display = "block";
                document.getElementById("contactRepPhone").textContent = rep.phone;
            } else {
                repPictureElement.style.display = "none";
            }

            // Hide contact elements if both phone and email are missing
            if (!rep.phone && !rep.email) {
                repPhoneElement.style.display = "none";
                repEmailElement.style.display = "none";
                if (repContactElement) {
                    repContactElement.style.display = "none";
                }
            }
        }

        function updateDisplayAfterFetch() {
            document.getElementById("loader").style.display = "none";
            document.getElementById("app").style.display = "block";
        }

        function displaySelectedAnswers(surveyData) {
            for (let questionNumber = 1; questionNumber <= surveyData.length; questionNumber++) {
                const selectedAnswer = surveyData[questionNumber - 1] + 1;
                const questionSection = document.getElementById(`q${questionNumber}`);

                if (questionSection) {
                    const answerDivs = questionSection.querySelectorAll('div[answer]');
                    answerDivs.forEach(div => {
                        const answerNumber = parseInt(div.getAttribute('answer'));
                        if (answerNumber !== selectedAnswer) {
                            div.style.display = 'none';
                        }
                    });
                }
            }
        }
