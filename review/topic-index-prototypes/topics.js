(function () {
  'use strict';

  var groups = {
    cyber: [
      ['Where Does Your Chat Go? Taking Care of Your Data in AI Tools', '/workshops/caring-for-your-data/', 'workshop'],
      ['How Scammers Fake It with AI', '/presentations/how-scammers-fake-it-with-ai/', 'presentation'],
      ['Is This a Scam? Ask an AI', '/presentations/ask-ai-is-this-a-scam/', 'interactive deck'],
      ["Why the Frontend Gate Fails, and the Real One Doesn't", '/presentations/why-the-frontend-gate-fails/', 'interactive deck'],
      ['MFA and Account Security', '/presentations/mfa-account-security/', 'presentation'],
      ['How Email Works', '/presentations/how-email-works/', 'interactive deck']
    ],
    ai: [
      ["Can You Tell If It's AI? Watermarking Explained", '/presentations/ai-watermarking-explained/', 'workshop + deck'],
      ['Which AI Is Best? Reading the Scoreboard Like a Pro', '/workshops/which-ai-is-best/', 'workshop'],
      ['Growing Up Digital: An AI World Tour', '/workshops/global-ai-world-tour/', 'workshop'],
      ['Bubble Trouble: Making Sense of the AI Economy', '/workshops/ai-bubble/', 'workshop'],
      ['The Price of Thinking: AI Subscriptions and the New Digital Divide', '/workshops/digital-equity/', 'workshop'],
      ['Your Brain on Autocomplete: Why Writing Still Matters', '/workshops/cognitive-cost/', 'workshop'],
      ['Beyond the Buzzword: What Does AI-Literate Actually Mean?', '/workshops/defining-ai-literacy/', 'workshop'],
      ["Australia's AI Laws: What's Coming", '/presentations/australias-ai-laws-explained/', 'presentation'],
      ['Cognitive Uploading: Thinking with a Second Brain', '/presentations/cognitive-uploading/', 'interactive deck'],
      ['Ancient Plagiarism: A Thought Experiment', '/presentations/ancient-plagiarism-thought-experiment/', 'interactive deck'],
      ['AI Detectors and the Base-Rate Trap', '/presentations/detection-and-base-rates/', 'interactive deck'],
      ['The Learning Science Behind Study and Learn', '/presentations/microsoft-study-and-learn-science/', 'interactive deck']
    ],
    tools: [
      ['Using AI in Excel: From Copilot Chat to Add-ins', '/presentations/using-ai-in-excel/', 'presentation'],
      ['Mermaid: Diagrams You Write Instead of Draw', '/presentations/diagrams-as-text/', 'interactive deck']
    ],
    making: [
      ['From Ranking to Being Cited', '/presentations/from-ranking-to-being-cited/', 'interactive deck'],
      ['Putting a Website Online, Explained', '/presentations/publishing-a-website/', 'interactive deck'],
      ['Are You a Robot? CAPTCHAs Explained', '/presentations/captchas-explained/', 'interactive deck'],
      ['Can I Print This? How 3D Printing Actually Works', '/presentations/how-3d-printing-works/', 'interactive deck']
    ],
    copilot: [
      ['Prompt Critics: Excel with Copilot', '/training-games/prompt-critics-excel/', 'presenter game'],
      ['Prompt Critics: Darwin Business Excel', '/training-games/prompt-critics-excel-darwin/', 'presenter game']
    ]
  };

  document.querySelectorAll('[data-topic-list]').forEach(function (list) {
    var topics = groups[list.getAttribute('data-topic-list')] || [];

    topics.forEach(function (topic) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      var title = document.createElement('span');
      var kind = document.createElement('span');

      link.href = topic[1];
      title.className = 'topic-title';
      title.textContent = topic[0];
      kind.className = 'topic-kind';
      kind.textContent = topic[2];
      link.appendChild(title);
      link.appendChild(kind);
      item.appendChild(link);
      list.appendChild(item);
    });
  });
}());
