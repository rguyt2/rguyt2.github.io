document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 800,
    easing: "ease",
    once: false,
  });

  // Create background images for timeline
  const timelineSection = document.getElementById("timeline");
  const backgroundImages = [];

  // Create background divs for each milestone
  for (let i = 1; i <= 5; i++) {
    const bgDiv = document.createElement("div");
    bgDiv.className = "timeline-background";
    bgDiv.style.backgroundImage = `url(assets/images/back${i}.jpg)`;
    timelineSection.insertBefore(bgDiv, timelineSection.firstChild);
    backgroundImages.push(bgDiv);
  }

  // Load YouTube API
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Function to be called when YouTube API is ready
  window.onYouTubeIframeAPIReady = function () {
    new YT.Player("youtube-player", {
      videoId: "JWfd3KWDF2o",
      playerVars: {
        autoplay: 1,
        controls: 1,
        showinfo: 0,
        rel: 0,
        iv_load_policy: 3,
        disablekb: 0,
        mute: 0,
        loop: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  // When player is ready
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // Handle video state changes
  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      document.querySelector(".video-container").classList.add("video-ended");
      setTimeout(() => {
        document
          .getElementById("timeline")
          .scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  }

  // Timeline animation
  const timelineFigure = document.querySelector(".timeline-figure");
  const milestones = document.querySelectorAll(".milestone");
  const milestonePositions = [];

  // Calculate milestone positions
  function calculateMilestonePositions() {
    milestonePositions.length = 0;
    milestones.forEach((milestone, index) => {
      const dot = milestone.querySelector(".milestone-dot");
      const dotPosition = dot.getBoundingClientRect().top + window.pageYOffset;
      const timelineOffset =
        timelineSection.getBoundingClientRect().top + window.pageYOffset;
      milestonePositions.push(dotPosition - timelineOffset);
    });
  }

  // Initialize milestone positions after images and content are loaded
  window.addEventListener("load", function () {
    calculateMilestonePositions();
    setTimeout(() => {
      if (milestones.length > 0) {
        milestones[0].classList.add("active");
        backgroundImages[0].classList.add("active");
        if (timelineFigure && milestonePositions.length > 0) {
          timelineFigure.style.top = `${milestonePositions[0]}px`;
        }
      }
    }, 500);
  });

  window.addEventListener("resize", calculateMilestonePositions);

  // Update timeline on scroll
  function updateTimeline() {
    const scrollPosition = window.pageYOffset;
    const timelineTop =
      timelineSection.getBoundingClientRect().top + window.pageYOffset;
    const scrollPositionInTimeline =
      scrollPosition - timelineTop + window.innerHeight / 2;

    let activeMilestoneIndex = -1;

    milestonePositions.forEach((position, index) => {
      if (scrollPositionInTimeline >= position) {
        activeMilestoneIndex = index;
      }
    });

    if (activeMilestoneIndex >= 0) {
      timelineFigure.style.top = `${milestonePositions[activeMilestoneIndex]}px`;

      milestones.forEach((milestone, index) => {
        if (index <= activeMilestoneIndex) {
          milestone.classList.add("active");
        } else {
          milestone.classList.remove("active");
        }
      });

      backgroundImages.forEach((bg, index) => {
        if (index === activeMilestoneIndex) {
          bg.classList.add("active");
        } else {
          bg.classList.remove("active");
        }
      });
    }
  }

  // Update on scroll
  window.addEventListener("scroll", updateTimeline);

  // Populate testimonials
  const testimonialsTrack = document.querySelector(".testimonials-track");
  if (testimonialsTrack) {
    const testimonials = [
      {
        name: "Mradul Agrawal",
        photo: "assets/images/mradul-photo1.jpg",
        content: "Met her a year back, and I'm glad I did",
      },
      {
        name: "Mradul Agrawal",
        photo: "assets/images/mradul-photo2.jpg",
        content: "100% recommended",
      },
      {
        name: "Mradul Agrawal",
        photo: "assets/images/mradul-photo3.jpg",
        content: "Sometimes gussi gussi, but I love her",
      },
      {
        name: "Mradul Agrawal",
        photo: "assets/images/mradul-photo4.jpg",
        content: "Very small, cute and easy to handle",
      },
      {
        name: "Mradul Agrawal",
        photo: "assets/images/mradul-photo5.jpg",
        content: "Yep thats my girlfriend",
      },
      {
        name: "Mradul Agrawal",
        photo: "assets/images/mradul-photo6.jpg",
        content: "Hehehe",
      },
    ];

    const createTestimonialItem = (testimonial) => {
      const testimonialItem = document.createElement("div");
      testimonialItem.className = "testimonial-item";

      testimonialItem.innerHTML = `
        <div class="testimonial-photo">
          <img src="${testimonial.photo}" alt="${testimonial.name}" onerror="this.src='assets/images/placeholder-profile.svg'">
        </div>
        <div class="testimonial-name">${testimonial.name}</div>
        <div class="testimonial-content">${testimonial.content}</div>
      `;

      return testimonialItem;
    };

    testimonials.forEach((testimonial) => {
      testimonialsTrack.appendChild(createTestimonialItem(testimonial));
    });

    testimonials.forEach((testimonial) => {
      testimonialsTrack.appendChild(createTestimonialItem(testimonial));
    });
  }

  // Handle funny choice section
  const yesButton = document.getElementById("yes-button");
  const noButton = document.getElementById("no-button");
  const ballsContainer = document.getElementById("balls-container");
  const funnyMessage = document.getElementById("funny-message");
  let activeBalls = [];
  let ballsGroupIndex = 0;

  if (yesButton && noButton) {
    yesButton.addEventListener("click", function () {
      createFallingBalls();
    });

    noButton.addEventListener("mouseover", function (e) {
      moveButtonAway(e, noButton);
      showFunnyMessage();
    });
  }

  // Function to create falling balls with photos
  function createFallingBalls() {
    const ballCount = 30;
    const sampleImages = [
      "assets/images/ball-1.jpeg",
      "assets/images/ball-2.jpeg",
      "assets/images/ball-3.jpeg",
      "assets/images/ball-4.jpeg",
      "assets/images/ball-5.jpeg",
      "assets/images/ball-6.jpeg",
    ];

    ballsGroupIndex++;
    const currentGroupIndex = ballsGroupIndex;
    const currentGroupBalls = [];

    for (let i = 0; i < ballCount; i++) {
      const ball = document.createElement("img");
      ball.className = "ball-image";
      ball.dataset.groupIndex = currentGroupIndex;

      const randomImage =
        sampleImages[Math.floor(Math.random() * sampleImages.length)];
      ball.src = randomImage;

      const startX = Math.random() * window.innerWidth * 0.8;
      const startY = -100 - Math.random() * 300;

      ball.style.left = `${startX}px`;
      ball.style.top = `${startY}px`;

      const size = 40 + Math.random() * 40;
      ball.style.width = `${size}px`;
      ball.style.height = `${size}px`;

      ballsContainer.appendChild(ball);
      currentGroupBalls.push(ball);

      setTimeout(() => {
        animateBallFalling(ball, startX);
      }, Math.random() * 1500);
    }

    activeBalls.push(...currentGroupBalls);

    setTimeout(() => {
      fadeOutBallGroup(currentGroupIndex);
    }, 15000 + Math.random() * 1000);
  }

  function fadeOutBallGroup(groupIndex) {
    const ballsToRemove = activeBalls.filter(
      (ball) => ball.dataset.groupIndex == groupIndex
    );

    ballsToRemove.forEach((ball) => {
      fadeOutBall(ball);
    });

    activeBalls = activeBalls.filter(
      (ball) => ball.dataset.groupIndex != groupIndex
    );
  }

  function fadeOutBall(ball) {
    let opacity = 1;
    const fadeInterval = setInterval(() => {
      opacity -= 0.05;
      ball.style.opacity = opacity;

      if (opacity <= 0) {
        clearInterval(fadeInterval);
        ball.remove();
      }
    }, 50);
  }

  function animateBallFalling(ball, startX) {
    let posY = parseFloat(ball.style.top);
    let posX = startX;
    let velocityY = 0.8 + Math.random() * 1.2;
    let velocityX = (Math.random() - 0.5) * 1.5;
    const gravity = 0.08;
    const bounce = 0.65;
    let rotation = 0;
    const rotationSpeed = (Math.random() - 0.5) * 3;
    const maxBottom = window.innerHeight - parseFloat(ball.style.height) - 10;

    let bounceCount = 0;
    const maxBounces = 2 + Math.floor(Math.random() * 3);

    function updatePosition() {
      velocityY += gravity;

      posY += velocityY;
      posX += velocityX;

      if (posY > maxBottom) {
        posY = maxBottom;
        if (bounceCount < maxBounces) {
          velocityY = -velocityY * bounce;
          bounceCount++;
        } else {
          velocityY = 0;
          velocityX *= 0.8;

          if (Math.abs(velocityX) < 0.1) {
            velocityX = 0;
            return;
          }
        }
      }

      const ballWidth = parseFloat(ball.style.width);

      if (posX < 0) {
        posX = 0;
        velocityX = -velocityX * 0.7;
      } else if (posX > window.innerWidth - ballWidth) {
        posX = window.innerWidth - ballWidth;
        velocityX = -velocityX * 0.7;
      }

      rotation += rotationSpeed;

      ball.style.top = `${posY}px`;
      ball.style.left = `${posX}px`;
      ball.style.transform = `rotate(${rotation}deg)`;

      if (velocityY !== 0 || Math.abs(velocityX) > 0.1) {
        requestAnimationFrame(updatePosition);
      }
    }

    requestAnimationFrame(updatePosition);
  }

  function moveButtonAway(event, button) {
    const section = document.getElementById("funny-choice");
    const sectionRect = section.getBoundingClientRect();
    const choiceContainer = document.querySelector(".choice-container");

    if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;

      const fleeDirectionX = mouseX < screenCenterX ? 1 : -1;
      const fleeDirectionY = mouseY < screenCenterY ? 1 : -1;

      const swingFactor = 50 + Math.random() * 100;

      let newX = mouseX + fleeDirectionX * swingFactor * (1 + Math.random());
      let newY = mouseY + fleeDirectionY * swingFactor * (1 + Math.random());

      const padding = 20;
      newX = Math.max(
        padding,
        Math.min(window.innerWidth - buttonWidth - padding, newX)
      );
      newY = Math.max(
        padding,
        Math.min(window.innerHeight - buttonHeight - padding, newY)
      );

      const containerRect = choiceContainer.getBoundingClientRect();
      const relativeX = newX - containerRect.left;
      const relativeY = newY - containerRect.top;

      button.style.position = "absolute";
      button.style.transition = "all 0.4s cubic-bezier(.18,.89,.32,1.28)";
      button.style.left = `${relativeX}px`;
      button.style.top = `${relativeY}px`;

      const randomRotation = -30 + Math.random() * 60;
      button.style.transform = `rotate(${randomRotation}deg)`;
    }
  }

  function showFunnyMessage() {
    funnyMessage.classList.add("show");

    setTimeout(() => {
      funnyMessage.classList.remove("show");
    }, 1500);
  }

  // Parallax effect on scroll
  window.addEventListener("scroll", function () {
    const scrollPosition = window.pageYOffset;

    document.querySelectorAll(".section").forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop - window.innerHeight &&
        scrollPosition <= sectionTop + sectionHeight
      ) {
        const speed = section.getAttribute("data-speed") || 0.2;
        const yPos = (scrollPosition - sectionTop) * speed;
        section.style.backgroundPositionY = `${yPos}px`;
      }
    });
  });

  // Add smooth scrolling for all links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Add scroll down functionality
  const scrollDown = document.querySelector(".scroll-down");
  if (scrollDown) {
    scrollDown.addEventListener("click", function () {
      document
        .getElementById("timeline")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  // Mini Game Implementation
  const itemsContainer = document.querySelector(".items-container");
  const leftBasket = document.querySelector(".left-basket");
  const rightBasket = document.querySelector(".right-basket");

  // Sample items data - you'll need to replace these with your actual images
  const gameItems = [
    { id: 1, image: "assets/images/item1.jpg", correctBasket: "right" }, // Mradul's item
    { id: 2, image: "assets/images/item2.jpg", correctBasket: "left" }, // Laaiva's item
    { id: 3, image: "assets/images/item3.jpg", correctBasket: "right" }, // Mradul's item
    { id: 4, image: "assets/images/item4.jpg", correctBasket: "left" }, // Laaiva's item
    { id: 5, image: "assets/images/item5.jpg", correctBasket: "right" }, // Mradul's item
    { id: 6, image: "assets/images/item6.jpg", correctBasket: "left" }, // Laaiva's item
  ];

  // Create game items
  function createGameItems() {
    if (!itemsContainer) {
      console.error("Items container not found!");
      return;
    }

    // Shuffle the items array to randomize their positions
    const shuffledItems = [...gameItems].sort(() => Math.random() - 0.5);

    shuffledItems.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "game-item";
      itemElement.draggable = true;
      itemElement.dataset.id = item.id;
      itemElement.dataset.correctBasket = item.correctBasket;

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = `Item ${item.id}`;
      img.draggable = false; // Prevent image from being dragged

      itemElement.appendChild(img);
      itemsContainer.appendChild(itemElement);

      // Add touch events for mobile devices
      itemElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      itemElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      itemElement.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });
    });
  }

  // Touch event handlers for mobile devices
  let touchStartX = 0;
  let touchStartY = 0;
  let currentTouchItem = null;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    currentTouchItem = this;
    this.classList.add("dragging");
  }

  function handleTouchMove(e) {
    if (!currentTouchItem) return;
    e.preventDefault();

    const touch = e.touches[0];
    const x = touch.clientX - touchStartX;
    const y = touch.clientY - touchStartY;

    currentTouchItem.style.transform = `translate(${x}px, ${y}px)`;
  }

  function handleTouchEnd(e) {
    if (!currentTouchItem) return;

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const basket = element?.closest(".basket");

    if (basket) {
      const isLeftBasket = basket.classList.contains("left-basket");
      const basketType = isLeftBasket ? "left" : "right";
      const isCorrect = currentTouchItem.dataset.correctBasket === basketType;

      if (isCorrect) {
        handleCorrectDrop(currentTouchItem, basket);
      } else {
        handleIncorrectDrop(currentTouchItem);
      }
    }

    currentTouchItem.style.transform = "";
    currentTouchItem.classList.remove("dragging");
    currentTouchItem = null;
  }

  // Initialize drag and drop
  function initDragAndDrop() {
    if (!itemsContainer || !leftBasket || !rightBasket) {
      console.error("Required elements not found!");
      return;
    }

    // Initialize central box items
    const items = document.querySelectorAll(".game-item");
    items.forEach((item) => {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragend", handleDragEnd);
    });

    // Initialize side items
    const sideItems = document.querySelectorAll(".side-item");
    sideItems.forEach((item) => {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragend", handleDragEnd);
      item.addEventListener("touchstart", handleTouchStart, { passive: false });
      item.addEventListener("touchmove", handleTouchMove, { passive: false });
      item.addEventListener("touchend", handleTouchEnd, { passive: false });
    });

    // Initialize baskets
    [leftBasket, rightBasket].forEach((basket) => {
      basket.addEventListener("dragover", handleDragOver);
      basket.addEventListener("dragenter", handleDragEnter);
      basket.addEventListener("dragleave", handleDragLeave);
      basket.addEventListener("drop", handleDrop);
    });
  }

  let draggedItem = null;
  let draggedItemClone = null;

  function handleDragStart(e) {
    draggedItem = this;
    this.classList.add("dragging");

    // Create a clone for the drag image
    draggedItemClone = this.cloneNode(true);
    draggedItemClone.style.position = "absolute";
    draggedItemClone.style.top = "-1000px";
    document.body.appendChild(draggedItemClone);
    e.dataTransfer.setDragImage(draggedItemClone, 40, 40);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.dataset.id);
  }

  function handleDragEnd(e) {
    this.classList.remove("dragging");
    if (draggedItemClone) {
      draggedItemClone.remove();
      draggedItemClone = null;
    }
    draggedItem = null;

    document.querySelectorAll(".basket").forEach((basket) => {
      basket.classList.remove("drag-over");
    });
  }

  function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-over");
  }

  function handleDragLeave(e) {
    this.classList.remove("drag-over");
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleCorrectDrop(item, basket) {
    const droppedItem = item.cloneNode(true);
    droppedItem.classList.remove("dragging");
    droppedItem.classList.add("dropped");

    let droppedItemsContainer = basket.querySelector(".dropped-items");
    if (!droppedItemsContainer) {
      droppedItemsContainer = document.createElement("div");
      droppedItemsContainer.className = "dropped-items";
      basket.appendChild(droppedItemsContainer);
    }

    const itemCount = droppedItemsContainer.children.length;
    const maxItemsPerRow = 2;
    const row = Math.floor(itemCount / maxItemsPerRow);
    const col = itemCount % maxItemsPerRow;

    droppedItem.style.position = "absolute";
    droppedItem.style.left = `${col * 90 + 10}px`;
    droppedItem.style.top = `${row * 90 + 10}px`;
    droppedItem.style.width = "70px";
    droppedItem.style.height = "70px";
    droppedItem.style.animation = "drop-in 0.5s ease forwards";
    droppedItem.classList.add("correct");

    setTimeout(() => {
      item.remove();
      droppedItemsContainer.appendChild(droppedItem);
      console.log("Item dropped, checking completion...");
      checkGameCompletion();
    }, 500);
  }

  function handleIncorrectDrop(item) {
    item.classList.add("incorrect");
    setTimeout(() => {
      item.classList.remove("incorrect");
    }, 500);
  }

  function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");

    if (!draggedItem) return;

    const basket = this.classList.contains("left-basket") ? "left" : "right";
    const isCorrect = draggedItem.dataset.correctBasket === basket;

    if (isCorrect) {
      handleCorrectDrop(draggedItem, this);
    } else {
      handleIncorrectDrop(draggedItem);
    }
  }

  function checkGameCompletion() {
    const remainingItems = document.querySelectorAll(".game-item, .side-item");
    console.log("Remaining items:", remainingItems.length);

    // Check if all items are in baskets
    const leftBasketItems =
      document.querySelector(".left-basket .dropped-items")?.children.length ||
      0;
    const rightBasketItems =
      document.querySelector(".right-basket .dropped-items")?.children.length ||
      0;
    const totalItemsInBaskets = leftBasketItems + rightBasketItems;

    console.log("Items in baskets:", totalItemsInBaskets);

    if (totalItemsInBaskets === 8) {
      console.log("Game completed!");

      // Remove any existing completion message
      const existingMessage = document.querySelector(".completion-message");
      if (existingMessage) {
        existingMessage.remove();
      }

      const completionMessage = document.createElement("div");
      completionMessage.className = "completion-message";
      completionMessage.innerHTML = `
        <h3>good girl hehehe</h3>
      `;

      // Add the message to the body
      document.body.appendChild(completionMessage);

      // Add confetti effect
      createConfetti();

      // Remove the message after 10 seconds
      setTimeout(() => {
        completionMessage.style.animation = "fadeOut 0.5s ease-out forwards";
        setTimeout(() => {
          completionMessage.remove();
        }, 500);
      }, 10000);
    }
  }

  // Add confetti effect function
  function createConfetti() {
    const colors = ["#ff6b9d", "#ffd0e0", "#ff3e78", "#fff5f8"];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }

  // Initialize the game
  if (itemsContainer) {
    createGameItems();
    initDragAndDrop();
  }
});
