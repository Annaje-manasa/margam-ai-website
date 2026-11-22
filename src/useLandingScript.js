import { useEffect } from 'react';

export function useLandingScript(containerRef, contentKey, isActive = true) {
  useEffect(() => {
    if (!isActive) return;
    const root = containerRef.current;
    if (!root) return;

    const s = root.querySelector('#bzx') || root;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function pad(n) {
      return (n < 10 ? '0' : '') + n;
    }

    // --- 1. Dual Urgency Timers ---
    const cdElements = s.querySelectorAll('.bz-cd');
    const tmrElements = s.querySelectorAll('.bz-tmr b');
    let cartDeadline = Date.now() + 240000;

    function triggerTick(el, text) {
      if (el.textContent !== text) {
        el.textContent = text;
        el.classList.remove('tk');
        void el.offsetWidth; // re-flow
        el.classList.add('tk');
      }
    }

    function updateTimers() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffSec = Math.max(0, Math.floor((midnight - now) / 1000));
      const hours = pad(Math.floor(diffSec / 3600));
      const mins = pad(Math.floor((diffSec % 3600) / 60));
      const secs = pad(diffSec % 60);
      const timeStr = `${hours}:${mins}:${secs}`;

      cdElements.forEach((el) => {
        el.textContent = timeStr;
      });

      if (tmrElements.length === 2) {
        let remaining = Math.ceil((cartDeadline - Date.now()) / 1000);
        if (remaining <= 0) {
          cartDeadline = Date.now() + 240000;
          remaining = 240;
        }
        triggerTick(tmrElements[0], pad(Math.floor(remaining / 60)));
        triggerTick(tmrElements[1], pad(remaining % 60));
      }
    }

    updateTimers();
    const timerInterval = setInterval(updateTimers, 1000);

    // --- 2. Copy Code Snippet ---
    const copyBtn = s.querySelector('.bz-cpb');
    let copyTimeout = null;

    if (copyBtn) {
      const copyTextSpan = copyBtn.querySelector('span');
      const handleCopy = () => {
        const codeElement = s.querySelector('.bz-cpc');
        const textToCopy = codeElement ? codeElement.textContent.trim() : 'LIMITED10';

        const showSuccess = () => {
          copyBtn.classList.add('ok');
          if (copyTextSpan) copyTextSpan.textContent = 'Copied!';
          clearTimeout(copyTimeout);
          copyTimeout = setTimeout(() => {
            copyBtn.classList.remove('ok');
            if (copyTextSpan) copyTextSpan.textContent = 'Copy code';
          }, 2200);
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(showSuccess).catch(() => {
            legacyCopy(textToCopy);
            showSuccess();
          });
        } else {
          legacyCopy(textToCopy);
          showSuccess();
        }
      };

      function legacyCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
        } catch (e) {}
        document.body.removeChild(ta);
      }

      copyBtn.addEventListener('click', handleCopy);
    }

    // --- 3. Smooth Anchor Scrolling ---
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.getElementById(href.slice(1));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    };
    root.addEventListener('click', handleAnchorClick);

    // --- 4. Infinite Marquee Duplication ---
    s.querySelectorAll('.bz-mq > div').forEach((marquee) => {
      if (marquee.children.length > 0 && !marquee.dataset.cloned) {
        marquee.innerHTML += marquee.innerHTML;
        marquee.dataset.cloned = 'true';
      }
    });

    // --- 5. WhatsApp Review Modal Dialog ---
    const dialog = root.querySelector('.bz-dlg');
    const reviewButtons = s.querySelectorAll('.bz-rvg button');
    let currentReviewIdx = 0;

    function showReview(idx) {
      if (!dialog || reviewButtons.length === 0) return;
      currentReviewIdx = (idx + reviewButtons.length) % reviewButtons.length;
      const btn = reviewButtons[currentReviewIdx];
      const img = dialog.querySelector('img');
      const counter = dialog.querySelector('.bz-dc');
      const fullSrc = btn.getAttribute('data-full') || btn.querySelector('img')?.getAttribute('src');

      if (img && fullSrc) img.src = fullSrc;
      if (counter) counter.textContent = `${currentReviewIdx + 1} / ${reviewButtons.length}`;
    }

    if (dialog && typeof dialog.showModal === 'function') {
      reviewButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          showReview(idx);
          dialog.showModal();
        });
      });

      const handleDialogClick = (e) => {
        const target = e.target;
        const navBtn = target.closest('.bz-nv');
        if (target === dialog || target.closest('.bz-dx')) {
          dialog.close();
        } else if (navBtn) {
          const delta = parseInt(navBtn.getAttribute('data-d'), 10) || 1;
          showReview(currentReviewIdx + delta);
        }
      };

      const handleDialogKeyDown = (e) => {
        if (e.key === 'ArrowLeft') showReview(currentReviewIdx - 1);
        if (e.key === 'ArrowRight') showReview(currentReviewIdx + 1);
      };

      dialog.addEventListener('click', handleDialogClick);
      dialog.addEventListener('keydown', handleDialogKeyDown);
    }

    // --- 6. Counter Easing [data-to] ---
    function animateCounters(container) {
      container.querySelectorAll('[data-to]').forEach((counter) => {
        const target = +counter.getAttribute('data-to');
        if (reducedMotion) {
          counter.textContent = target;
          return;
        }
        counter.textContent = '0';
        let startTime = 0;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min(1, (timestamp - startTime) / 900);
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.round(target * easeOutCubic);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    // --- 7. Timed Reel Simulation Engine ---
    const allVideos = [];
    const reelSimulators = [];
    s.querySelectorAll('.bz-ph[data-reel]').forEach((phone) => {
      if (!phone.getAttribute('data-src')) {
        const sim = {
          phone,
          scenes: Array.from(phone.querySelectorAll('.bz-sc')),
          idx: -1,
          running: false,
          visible: false,
          totalDuration: 0,
          progressBar: phone.querySelector('.pb i'),
          flashOverlay: phone.querySelector('.bz-fl'),
          timeout: null,
          progressAnim: null
        };

        sim.scenes.forEach((sc) => {
          sim.totalDuration += +sc.getAttribute('data-t') || 2;
          sc.querySelectorAll('.bz-cw').forEach((cw) => {
            Array.from(cw.children).forEach((word, wIdx) => {
              word.style.setProperty('--w', wIdx);
            });
          });
        });

        phone._sim = sim;
        reelSimulators.push(sim);
      } else {
        const video = phone.querySelector('video');
        if (video) {
          allVideos.push(video);
          phone.style.cursor = 'pointer';
          phone.addEventListener('click', () => {
            video.muted = !video.muted;
          });
          video.addEventListener('timeupdate', () => {
            const pb = phone.querySelector('.pb i');
            if (pb && video.duration) {
              pb.style.transform = `scaleX(${video.currentTime / video.duration})`;
            }
          });
        }
      }
    });

    function playNextScene(sim) {
      const prevScene = sim.scenes[sim.idx];
      if (prevScene) prevScene.classList.remove('on');

      sim.idx = (sim.idx + 1) % sim.scenes.length;
      const currentScene = sim.scenes[sim.idx];

      sim.phone.classList.add('rn');
      currentScene.classList.add('on');

      if (sim.idx === 0 && sim.progressBar && sim.progressBar.animate) {
        if (sim.progressAnim) sim.progressAnim.cancel();
        sim.progressAnim = sim.progressBar.animate(
          [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
          { duration: sim.totalDuration * 1000, fill: 'forwards' }
        );
      }

      if (prevScene && sim.flashOverlay && sim.flashOverlay.animate) {
        sim.flashOverlay.animate([{ opacity: 0.45 }, { opacity: 0 }], {
          duration: 260,
          easing: 'ease-out'
        });
      }

      animateCounters(currentScene);

      const sceneDuration = (+currentScene.getAttribute('data-t') || 2) * 1000;
      sim.timeout = setTimeout(() => {
        playNextScene(sim);
      }, sceneDuration);
    }

    function startReel(sim) {
      if (sim.running || reducedMotion) return;
      sim.running = true;
      if (sim.progressAnim) sim.progressAnim.play();
      playNextScene(sim);
    }

    function pauseReel(sim) {
      if (!sim.running) return;
      sim.running = false;
      clearTimeout(sim.timeout);
      if (sim.progressAnim) sim.progressAnim.pause();
    }

    // --- 8. Demo Video Players ---
    function stopOtherVideos(activeVideo) {
      s.querySelectorAll('.bz-cs video').forEach((v) => {
        v.muted = true;
        v.closest('.bz-cs')?.classList.remove('snd');
      });
      allVideos.forEach((v) => {
        if (v !== activeVideo && !v.muted && !v.paused) {
          v.pause();
        }
      });
    }

    s.querySelectorAll('.bz-demo').forEach((demoBox) => {
      const video = demoBox.querySelector('video');
      const playBtn = demoBox.querySelector('.bz-dpl');
      if (!video) return;

      if (!video.getAttribute('poster') && video.getAttribute('data-poster')) {
        video.poster = video.getAttribute('data-poster');
      }
      const targetSrc = video.getAttribute('src') || video.getAttribute('data-src');
      if (targetSrc && (!video.src || !video.src.includes('.mp4'))) {
        video.src = targetSrc;
      }

      allVideos.push(video);

      const onPlaying = () => {
        demoBox.classList.remove('ld');
        demoBox.classList.add('on');
      };
      const onError = () => {
        demoBox.classList.remove('ld');
      };

      const startVideoPlayback = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        stopOtherVideos(video);
        if (targetSrc && (!video.src || !video.src.includes('.mp4'))) {
          video.src = targetSrc;
        }
        video.controls = true;
        demoBox.classList.add('on');
        if (video.ended) video.currentTime = 0;
        if (video.readyState < 3) demoBox.classList.add('ld');

        video.muted = false;
        const playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch((err) => {
            console.warn('Playback with audio blocked, falling back to muted playback:', err);
            video.muted = true;
            video.play().catch((err2) => {
              console.error('Muted video playback failed:', err2);
              onError();
            });
          });
        }
      };

      if (playBtn) {
        playBtn.addEventListener('click', startVideoPlayback);
      }
      demoBox.addEventListener('click', (e) => {
        if (!demoBox.classList.contains('on') || video.paused) {
          startVideoPlayback(e);
        }
      });

      video.addEventListener('playing', onPlaying);
      video.addEventListener('pause', onPlaying);
      video.addEventListener('error', onError);
      video.addEventListener('ended', () => {
        demoBox.classList.remove('on');
        video.controls = false;
      });
    });

    // --- 9. Carousel Showcase Sound & Mute Toggle ---
    const carouselGrid = s.querySelector('.bz-csg');
    let carouselObserver = null;
    let handleCarouselClick = null;

    if (carouselGrid) {
      function toggleShowcaseSound(card, video) {
        if (!video) return;

        const isCurrentlySoundOn = card.classList.contains('snd') && !video.muted;

        if (isCurrentlySoundOn) {
          // Turn sound OFF
          video.muted = true;
          video.setAttribute('muted', '');
          card.classList.remove('snd');
        } else {
          // Turn sound ON
          // Mute all other carousel videos first
          s.querySelectorAll('.bz-cs video').forEach((otherVid) => {
            if (otherVid !== video) {
              otherVid.muted = true;
              otherVid.setAttribute('muted', '');
              otherVid.closest('.bz-cs')?.classList.remove('snd');
            }
          });
          // Pause any demo videos
          allVideos.forEach((v) => {
            if (v !== video && !v.paused) v.pause();
          });

          // Unmute target video
          video.removeAttribute('muted');
          video.muted = false;
          video.defaultMuted = false;
          video.volume = 1;
          video.currentTime = 0;
          card.classList.add('snd');

          const playPromise = video.play();
          if (playPromise && playPromise.catch) {
            playPromise.catch((err) => {
              console.warn('Playback error on sound toggle:', err);
              if (err && err.name === 'NotAllowedError') {
                video.muted = true;
                video.setAttribute('muted', '');
                card.classList.remove('snd');
                video.play().catch(() => {});
              }
            });
          }
        }
      }

      handleCarouselClick = (e) => {
        const target = e.target;
        const toggleBtn = target.closest('.bz-csa');
        const cse = target.closest('.bz-cse');

        if (toggleBtn || cse) {
          const card = target.closest('.bz-cs');
          if (!card) return;
          const video = card.querySelector('video');
          if (!video) return;

          e.preventDefault();
          e.stopPropagation();
          toggleShowcaseSound(card, video);
        }
      };

      carouselGrid.addEventListener('click', handleCarouselClick);

      if ('IntersectionObserver' in window) {
        carouselObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const card = entry.target;
              const video = card.querySelector('video');
              if (!video) return;

              if (entry.isIntersecting) {
                if (video.paused) {
                  video.play().catch(() => {});
                }
              } else {
                video.pause();
                video.muted = true;
                video.setAttribute('muted', '');
                card.classList.remove('snd');
              }
            });
          },
          { threshold: 0.15 }
        );

        carouselGrid.querySelectorAll('.bz-cs').forEach((card) => {
          carouselObserver.observe(card);
        });
      }
    }

    // --- 10. Intersection Observers for Autoplay & Visibility ---
    s.classList.add('bz-js');
    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target;
            const sim = target._sim;
            const isVisible = entry.isIntersecting;
            target.classList.toggle('bz-zz', !isVisible);

            if (sim) {
              sim.visible = isVisible;
              if (isVisible) startReel(sim);
              else pauseReel(sim);
            }
            const video = target.querySelector('video');
            if (video) {
              if (isVisible) {
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            }
          });
        },
        { threshold: 0.15 }
      );

      s.querySelectorAll('.bz-ph[data-reel]').forEach((phone) => {
        observer.observe(phone);
      });
    } else {
      reelSimulators.forEach(startReel);
    }

    // --- 11. Sticky Offer Bar & Bottom Docking ---
    const offerBar = root.querySelector('.elementor-element-45be476');
    const footerBar = root.querySelector('.elementor-element-c571121');
    let spacer = null;
    let handleScrollOrResize = null;

    if (offerBar && footerBar && offerBar.parentElement) {
      spacer = offerBar.parentElement.querySelector('.elementor-sticky__spacer');
      if (!spacer) {
        spacer = document.createElement('div');
        spacer.className = 'elementor-sticky__spacer';
        offerBar.parentElement.insertBefore(spacer, footerBar);
      }
      spacer.style.height = `${offerBar.offsetHeight || 106}px`;

      const updateDocking = () => {
        if (!offerBar || !footerBar) return;
        const footerHeight = footerBar.offsetHeight || 51;
        const barHeight = offerBar.offsetHeight || 106;
        if (spacer) {
          spacer.style.height = `${barHeight}px`;
        }

        const docHeight = document.documentElement.scrollHeight;
        const scrollBottom = window.scrollY + window.innerHeight;
        const distanceToBottom = Math.max(0, docHeight - scrollBottom);

        if (distanceToBottom < footerHeight) {
          const overlap = footerHeight - distanceToBottom;
          offerBar.style.setProperty('bottom', `${overlap}px`, 'important');
        } else {
          offerBar.style.setProperty('bottom', '0px', 'important');
        }
      };

      handleScrollOrResize = updateDocking;
      updateDocking();

      window.addEventListener('scroll', handleScrollOrResize, { passive: true });
      window.addEventListener('resize', handleScrollOrResize, { passive: true });
    }

    // Cleanup on unmount
    return () => {
      clearInterval(timerInterval);
      clearTimeout(copyTimeout);
      root.removeEventListener('click', handleAnchorClick);
      if (observer) observer.disconnect();
      if (carouselObserver) carouselObserver.disconnect();
      if (carouselGrid && handleCarouselClick) {
        carouselGrid.removeEventListener('click', handleCarouselClick);
      }
      reelSimulators.forEach(pauseReel);
      allVideos.forEach((v) => v.pause());
      if (handleScrollOrResize) {
        window.removeEventListener('scroll', handleScrollOrResize);
        window.removeEventListener('resize', handleScrollOrResize);
      }
      if (spacer && spacer.parentElement) {
        spacer.parentElement.removeChild(spacer);
      }
    };
  }, [containerRef, contentKey, isActive]);
}

