document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('stage');
  
  // Define an asynchronous function to fetch and display the submissions
  async function renderSubmissions() {
    try {
      const response = await fetch('./submissions.json');
      
      // Handle server error responses (e.g., 404 or 500 errors)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Clear any placeholder text or previous runs from the stage
      stage.innerHTML = '';
      
      // Handle the edge case where the array is empty
      if (data.length === 0) {
        stage.innerHTML = '<p class="empty-state">No submissions found yet.</p>';
        return;
      }
      
      // Create a container element to wrap our list items safely
      const listContainer = document.createElement('ul');
      listContainer.className = 'submission-list';
      
      // Loop through each valid submission object
      data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'submission-item';
        
        // Convert the UNIX timestamp into a human-readable local date/time string
        const formattedDate = new Date(item.timestamp * 1000).toLocaleString();
        
        // Use textContent to safely output the values and prevent XSS injections
        const dateElement = document.createElement('time');
        dateElement.textContent = formattedDate;
        
        const valueElement = document.createElement('span');
        valueElement.className = 'submission-value';
        valueElement.textContent = item.value;
        
        // Assemble the list item node tree
        listItem.appendChild(dateElement);
        listItem.appendChild(document.createTextNode(' — '));
        listItem.appendChild(valueElement);
        
        listContainer.appendChild(listItem);
      });
      
      // Inject the completed DOM tree into the stage layout in one single render pass
      stage.appendChild(listContainer);
      
    } catch (error) {
      console.error('Failed to load submissions:', error);
      stage.innerHTML = '<p class="error-state">Error loading submission data.</p>';
    }
  }

  // Trigger the render cycle immediately upon page load
  renderSubmissions();
});
