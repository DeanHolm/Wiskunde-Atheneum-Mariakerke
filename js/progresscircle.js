document.addEventListener("DOMContentLoaded", function () {

    function getCurrentSchoolYear() {
      const today = new Date();
      const year = today.getFullYear();
      let start, end;
  
      if (today.getMonth() >= 8) {
        start = new Date(year, 8, 1);
        end = new Date(year + 1, 5, 30);
      } else {
        start = new Date(year - 1, 8, 1);
        end = new Date(year, 5, 30);
      }
      return { start, end };
    }
  
    function updateSchoolYearProgress() {
  
      const circle = document.querySelector('.progress');
      if (!circle) return; // extra veiligheid
  
      const { start, end } = getCurrentSchoolYear();
      const today = new Date();
  
      const total = end - start;
      const passed = today - start;
      let percent = Math.floor((passed / total) * 100);
      percent = Math.max(0, Math.min(100, percent));
  
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
  
      document.getElementById('percentage').textContent = percent + '%';
    }
  
    updateSchoolYearProgress();
    setInterval(updateSchoolYearProgress, 86400000);
  });
  