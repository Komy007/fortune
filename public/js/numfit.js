// 숫자 택일 서비스 JavaScript

class NumerologyApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDates();
    }

    setupEventListeners() {
        // 탭 네비게이션
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 폼 제출 이벤트
        document.getElementById('luckyNumbersForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.analyzeLuckyNumbers();
        });

        document.getElementById('phoneAnalysisForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.analyzePhoneNumber();
        });

        document.getElementById('carAnalysisForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.analyzeCarNumber();
        });

        document.getElementById('personalAnalysisForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.analyzePersonalNumber();
        });

        document.getElementById('dateSelectionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.selectDateForPurpose();
        });

        document.getElementById('comprehensiveForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.getComprehensiveAnalysis();
        });
    }

    setDefaultDates() {
        // 시작일을 오늘로 설정
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').value = today;
    }

    switchTab(tabName) {
        // 모든 탭 비활성화
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 선택된 탭 활성화
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        alert(`오류: ${message}`);
    }

    // 길한 숫자 분석
    async analyzeLuckyNumbers() {
        const formData = new FormData(document.getElementById('luckyNumbersForm'));
        const data = {
            birthYear: parseInt(formData.get('birthYear')),
            birthMonth: parseInt(formData.get('birthMonth')),
            birthDay: parseInt(formData.get('birthDay')),
            birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0
        };

        try {
            this.showLoading();
            const response = await fetch('/api/numerology/lucky-numbers', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
                this.displayLuckyNumbersResult(result.data);
        } else {
                this.showError(result.message);
        }
    } catch (error) {
            this.showError('서버 연결 오류가 발생했습니다.');
    } finally {
            this.hideLoading();
        }
    }

    displayLuckyNumbersResult(data) {
        const resultSection = document.getElementById('luckyNumbersResult');
        
        // 길한 숫자 표시
        const luckyNumbersList = document.getElementById('luckyNumbersList');
        luckyNumbersList.innerHTML = data.luckyNumbers.map(num => 
            `<div class="number-item">${num}</div>`
        ).join('');

        // 길한 색상 표시
        const luckyColorsList = document.getElementById('luckyColorsList');
        luckyColorsList.innerHTML = data.luckyColors.map(color => 
            `<div class="color-item">${color}</div>`
        ).join('');

        // 길한 방향 표시
        const luckyDirectionsList = document.getElementById('luckyDirectionsList');
        luckyDirectionsList.innerHTML = data.luckyDirections.map(direction => 
            `<div class="direction-item">${direction}</div>`
        ).join('');

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 전화번호 분석
    async analyzePhoneNumber() {
        const formData = new FormData(document.getElementById('phoneAnalysisForm'));
        const data = {
            phoneNumber: formData.get('phoneNumber'),
            birthYear: parseInt(formData.get('birthYear')),
            birthMonth: parseInt(formData.get('birthMonth')),
            birthDay: parseInt(formData.get('birthDay')),
            birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0
        };

        try {
            this.showLoading();
            const response = await fetch('/api/numerology/phone-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                this.displayPhoneAnalysisResult(result.data);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            this.showError('서버 연결 오류가 발생했습니다.');
        } finally {
            this.hideLoading();
        }
    }

    displayPhoneAnalysisResult(data) {
        const resultSection = document.getElementById('phoneAnalysisResult');
        
        // 점수 표시
        document.getElementById('phoneScore').textContent = data.score;
        document.getElementById('phoneGrade').textContent = data.grade;
        document.getElementById('phoneRecommendation').textContent = data.recommendation;

        // 자릿수별 분석 표시
        const digitAnalysis = document.getElementById('phoneDigitAnalysis');
        digitAnalysis.innerHTML = data.analysis.map(item => `
            <div class="digit-item ${item.status === '길' ? 'good' : 'normal'}">
                <div class="digit-number">${item.digit}</div>
                <div class="digit-status ${item.status === '길' ? 'good' : 'normal'}">${item.status}</div>
                <div class="digit-element">${item.element}</div>
            </div>
        `).join('');

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 차량번호 분석
    async analyzeCarNumber() {
        const formData = new FormData(document.getElementById('carAnalysisForm'));
        const data = {
            carNumber: formData.get('carNumber'),
            birthYear: parseInt(formData.get('birthYear')),
            birthMonth: parseInt(formData.get('birthMonth')),
            birthDay: parseInt(formData.get('birthDay')),
            birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0
        };

        try {
            this.showLoading();
            const response = await fetch('/api/numerology/car-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                this.displayCarAnalysisResult(result.data);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            this.showError('서버 연결 오류가 발생했습니다.');
        } finally {
            this.hideLoading();
        }
    }

    displayCarAnalysisResult(data) {
        const resultSection = document.getElementById('carAnalysisResult');
        
        // 점수 표시
        document.getElementById('carScore').textContent = data.score;
        document.getElementById('carGrade').textContent = data.grade;
        document.getElementById('carRecommendation').textContent = data.recommendation;

        // 자릿수별 분석 표시
        const digitAnalysis = document.getElementById('carDigitAnalysis');
        digitAnalysis.innerHTML = data.analysis.map(item => `
            <div class="digit-item ${item.status === '길' ? 'good' : 'normal'}">
                <div class="digit-number">${item.digit}</div>
                <div class="digit-status ${item.status === '길' ? 'good' : 'normal'}">${item.status}</div>
                <div class="digit-element">${item.element}</div>
            </div>
        `).join('');

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 개인숫자 분석
    async analyzePersonalNumber() {
        const formData = new FormData(document.getElementById('personalAnalysisForm'));
        const data = {
            personalNumber: formData.get('personalNumber'),
            birthYear: parseInt(formData.get('birthYear')),
            birthMonth: parseInt(formData.get('birthMonth')),
            birthDay: parseInt(formData.get('birthDay')),
            birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0
        };

        try {
            this.showLoading();
            const response = await fetch('/api/numerology/personal-analysis', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
                this.displayPersonalAnalysisResult(result.data);
        } else {
                this.showError(result.message);
        }
    } catch (error) {
            this.showError('서버 연결 오류가 발생했습니다.');
    } finally {
            this.hideLoading();
        }
    }

    displayPersonalAnalysisResult(data) {
        const resultSection = document.getElementById('personalAnalysisResult');
        
        // 점수 표시
        document.getElementById('personalScore').textContent = data.score;
        document.getElementById('personalGrade').textContent = data.grade;
        document.getElementById('personalRecommendation').textContent = data.recommendation;

        // 자릿수별 분석 표시
        const digitAnalysis = document.getElementById('personalDigitAnalysis');
        digitAnalysis.innerHTML = data.analysis.map(item => `
            <div class="digit-item ${item.status === '길' ? 'good' : 'normal'}">
                <div class="digit-number">${item.digit}</div>
                <div class="digit-status ${item.status === '길' ? 'good' : 'normal'}">${item.status}</div>
                <div class="digit-element">${item.element}</div>
            </div>
        `).join('');

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 택일 서비스
    async selectDateForPurpose() {
        const formData = new FormData(document.getElementById('dateSelectionForm'));
        const data = {
            purpose: formData.get('purpose'),
            birthYear: parseInt(formData.get('birthYear')),
            birthMonth: parseInt(formData.get('birthMonth')),
            birthDay: parseInt(formData.get('birthDay')),
            birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0,
            startDate: formData.get('startDate'),
            days: parseInt(formData.get('days'))
        };

        try {
            this.showLoading();
            const response = await fetch('/api/numerology/date-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                this.displayDateSelectionResult(result.data);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            this.showError('서버 연결 오류가 발생했습니다.');
        } finally {
            this.hideLoading();
        }
    }

    displayDateSelectionResult(data) {
        const resultSection = document.getElementById('dateSelectionResult');
        const recommendationsContainer = document.getElementById('dateRecommendations');
        
        recommendationsContainer.innerHTML = data.recommendations.map(item => `
            <div class="date-item">
                <div class="date-date">${this.formatDate(item.date)}</div>
                <div class="date-score">점수: ${item.score}점</div>
                <div class="date-grade">등급: ${item.grade}</div>
                <ul class="date-reasons">
                    ${item.reasons.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // 종합 분석
    async getComprehensiveAnalysis() {
        const formData = new FormData(document.getElementById('comprehensiveForm'));
        const data = {
            phoneNumber: formData.get('phoneNumber'),
            carNumber: formData.get('carNumber'),
            personalNumber: formData.get('personalNumber'),
            birthYear: parseInt(formData.get('birthYear')),
            birthMonth: parseInt(formData.get('birthMonth')),
            birthDay: parseInt(formData.get('birthDay')),
            birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0
        };

        try {
            this.showLoading();
            const response = await fetch('/api/numerology/comprehensive-analysis', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
            },
                body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
                this.displayComprehensiveResult(result.data);
        } else {
                this.showError(result.message);
        }
    } catch (error) {
            this.showError('서버 연결 오류가 발생했습니다.');
    } finally {
            this.hideLoading();
        }
    }

    displayComprehensiveResult(data) {
        const resultSection = document.getElementById('comprehensiveResult');
        
        // 길한 숫자 표시
        const compLuckyNumbers = document.getElementById('compLuckyNumbers');
        compLuckyNumbers.innerHTML = data.luckyNumbers.map(num => 
            `<div class="number-item">${num}</div>`
        ).join('');

        // 전화번호 분석 표시
        const compPhoneAnalysis = document.getElementById('compPhoneAnalysis');
        if (data.phoneAnalysis) {
            compPhoneAnalysis.innerHTML = `
                <p><strong>점수:</strong> ${data.phoneAnalysis.score}점 (${data.phoneAnalysis.grade})</p>
                <p><strong>추천:</strong> ${data.phoneAnalysis.recommendation}</p>
            `;
        } else {
            compPhoneAnalysis.innerHTML = '<p>전화번호를 입력하지 않았습니다.</p>';
        }

        // 차량번호 분석 표시
        const compCarAnalysis = document.getElementById('compCarAnalysis');
        if (data.carAnalysis) {
            compCarAnalysis.innerHTML = `
                <p><strong>점수:</strong> ${data.carAnalysis.score}점 (${data.carAnalysis.grade})</p>
                <p><strong>추천:</strong> ${data.carAnalysis.recommendation}</p>
            `;
        } else {
            compCarAnalysis.innerHTML = '<p>차량번호를 입력하지 않았습니다.</p>';
        }

        // 개인숫자 분석 표시
        const compPersonalAnalysis = document.getElementById('compPersonalAnalysis');
        if (data.personalAnalysis) {
            compPersonalAnalysis.innerHTML = `
                <p><strong>점수:</strong> ${data.personalAnalysis.score}점 (${data.personalAnalysis.grade})</p>
                <p><strong>추천:</strong> ${data.personalAnalysis.recommendation}</p>
            `;
        } else {
            compPersonalAnalysis.innerHTML = '<p>개인숫자를 입력하지 않았습니다.</p>';
        }

        // 길한 색상 표시
        const compLuckyColors = document.getElementById('compLuckyColors');
        compLuckyColors.innerHTML = data.recommendations.luckyColors.map(color => 
            `<div class="color-item">${color}</div>`
        ).join('');

        // 길한 방향 표시
        const compLuckyDirections = document.getElementById('compLuckyDirections');
        compLuckyDirections.innerHTML = data.recommendations.luckyDirections.map(direction => 
            `<div class="direction-item">${direction}</div>`
        ).join('');

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
        return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new NumerologyApp();
});
