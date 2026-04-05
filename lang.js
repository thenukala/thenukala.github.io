/**
 * lang.js — Complete English / Telugu translations
 * Translates: nav, hero, buttons, filters, cards, labels, footers
 */
(function(){
  'use strict';
  const LK = 'nukala_lang';

  const T = {
    en: {
      // Nav links
      nav_home:'Home', nav_tree:'Family Tree', nav_history:'History',
      nav_gallery:'Gallery', nav_facts:'Facts', nav_stats:'Stats',
      nav_events:'Events', nav_map:'Map', nav_polls:'Polls',
      nav_recipes:'Recipes', nav_achievements:'Achievements',
      nav_videos:'Videos', nav_share:'QR Code', nav_contact:'Contact',
      nav_join:'Join Tree', nav_about:'About',
      // Sign out
      signout:'Sign Out',
      // Login page
      login_title:'The Nukala Family Tree',
      login_sub:'A private family archive \u00b7 Enter your password to continue',
      login_placeholder:'Enter family password',
      login_btn:'Enter Family Archive \u2192',
      login_note:'This site is exclusively for the Nukala family.',
      // Home hero
      hero_eyebrow:'Welcome to the',
      hero_title_1:'The', hero_title_em:'Nukala', hero_title_2:'Family Archive',
      hero_tagline:'A private space to celebrate our roots, preserve our stories, and stay connected across generations.',
      stat1_lbl:'Generations', stat2_lbl:'Family Members', stat3_lbl:'Stories Shared',
      about_title:'Our Roots Run Deep',
      about_p1:'Welcome to the Nukala Family Tree \u2014 a private, members-only archive dedicated to preserving and celebrating our shared heritage.',
      about_p2:'This site is a living record of who we are: our ancestors, our stories, our photos, and the bonds that tie us together.',
      about_p3:'We invite every family member to contribute \u2014 add your memories, upload old photographs, and help build this archive for generations to come.',
      recent_updates:'Recent Updates',
      // Quick cards
      card_tree_title:'Family Tree', card_tree_desc:'Explore our family connections, branches, and lineage.', card_tree_arrow:'View tree \u2192',
      card_history_title:'Our History', card_history_desc:'Read stories, milestones, and heritage of the Nukala family.', card_history_arrow:'Read more \u2192',
      card_gallery_title:'Photo Gallery', card_gallery_desc:'Browse cherished photos and memories across the years.', card_gallery_arrow:'View photos \u2192',
      card_contact_title:'Get in Touch', card_contact_desc:'Contribute your own stories, photos, or corrections.', card_contact_arrow:'Contact us \u2192',
      // History
      hist_eyebrow:'Our Story', hist_title_em:'Nukala', hist_title:'Family History',
      hist_sub:'A journey through time \u2014 the milestones, moments, and memories that shaped who we are.',
      hist_quote:'\u201cA family\'s story is a river \u2014 it flows through time, carves its own path, and nourishes everything it touches.\u201d',
      add_story:'+ Add a Story',
      // Gallery
      gal_eyebrow:'Memories', gal_title_em:'Nukala', gal_title:'Photo Gallery',
      gal_sub:'A visual archive of cherished moments, celebrations, and faces across the years.',
      filter_all:'All Photos', filter_family:'Family', filter_vintage:'Vintage',
      filter_celebrations:'Celebrations', filter_travel:'Travel', filter_other:'Other',
      // Facts
      facts_eyebrow:'Did You Know?', facts_title:'Interesting Family Facts',
      facts_sub:'Fascinating milestones, traditions, and records that make the Nukala family unique.',
      filter_achievements:'Achievements', filter_milestones:'Milestones',
      filter_traditions:'Traditions', filter_records:'Records', filter_fun:'Fun Facts',
      // Stats
      stats_eyebrow:'By The Numbers', stats_title:'Family Statistics',
      stats_sub:'Fascinating insights into the Nukala family \u2014 our reach, our roots, and our remarkable story.',
      // Events
      evts_eyebrow:'Upcoming', evts_title:'Family Events',
      evts_sub:'Reunions, celebrations, and gatherings \u2014 stay connected and never miss a moment.',
      // Recipes
      rec_eyebrow:'Traditional', rec_title:'Family Recipes',
      rec_sub:'Cherished recipes passed down through generations \u2014 the tastes of home.',
      // Achievements
      ach_eyebrow:'Pride of the Family', ach_title:'Family Achievements',
      ach_sub:'Degrees, awards, honours, and proud milestones that make us who we are.',
      // Videos
      vid_eyebrow:'Memories in Motion', vid_title:'Family Videos',
      vid_sub:'Memorable moments captured on film \u2014 watch our story unfold.',
      // Map
      map_eyebrow:'Where We Are', map_title:'Family Map',
      map_sub:'See where members of the Nukala family are located around the world.',
      // Polls
      poll_eyebrow:'Have Your Say', poll_title:'Family Polls',
      poll_sub:'Every voice counts \u2014 share your opinion on family matters.',
      // QR
      qr_eyebrow:'Share the Site', qr_title:'Family QR Code',
      qr_sub:'Scan or share this code to bring more family members to the archive.',
      // Tree
      tree_eyebrow:'Our Roots', tree_title_em:'Nukala', tree_title:'Family Tree',
      tree_sub:'Click any family member to discover their story and connections.',
      'btn-fit':'Fit to Screen', 'btn-reset':'Reset View',
      // Contact
      cont_eyebrow:'Contribute', cont_title:'Get In Touch',
      cont_sub:'Share a story, submit a photo, or suggest a correction.',
      form_fn:'First Name', form_ln:'Last Name', form_email:'Email',
      form_subj:'Subject', form_msg:'Message', form_btn:'Send Message',
      // Join Tree page
      join_eyebrow:'Join the Family', join_title:'Join the Family Tree',
      join_sub:'Help us build the most complete Nukala family archive. Fill in as much or as little as you like \u2014 every detail helps.',
      join_personal:'Personal Details', join_connections:'Family Connections', join_contact_details:'Contact Details',
      join_firstname:'First Name', join_lastname:'Last Name', join_dob:'Date of Birth',
      join_gender:'Gender', join_city:'City / Town you live in', join_occ:'Occupation', join_bio:'Short Bio / Fun Fact about yourself',
      join_father:"Father's Full Name", join_mother:"Mother's Full Name", join_spouse:"Spouse's Full Name",
      join_anniversary:'Wedding Anniversary Date', join_children:"Children's Names & Birth Years",
      join_siblings:"Siblings' Names", join_wa:'WhatsApp Number', join_email:'Email Address',
      join_photo:'Photo URL (optional)', join_photo_note:'Upload a photo to Google Photos, share it, and paste the link here',
      join_note:'Fields marked * are helpful but nothing is strictly required \u2014 share what you\'re comfortable with.',
      join_submit_note:'When you click below, your details will open in WhatsApp or Email \u2014 pre-filled and ready to send to the family admin.',
      join_send_wa:'Send via WhatsApp', join_send_email:'Send via Email',
      // About page
      about_eyebrow:'About This Project', about_title_str:'About This Project',
      about_sub:'The story behind the Nukala Family Archive \u2014 who built it, who inspired it, and who made it possible.',
      about_coming_soon:'About page coming soon', about_coming_sub:'The admin will add details here shortly.',
      // Footer
      footer_private:'Private & Password Protected \u00b7 Made with love',
    },

    te: {
      // Nav links
      nav_home:'\u0c39\u0c4b\u0c2e\u0c4d', nav_tree:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c43\u0c15\u0c4d\u0c37\u0c02', nav_history:'\u0c1a\u0c30\u0c3f\u0c24\u0c4d\u0c30',
      nav_gallery:'\u0c17\u0c4d\u0c2f\u0c3e\u0c32\u0c30\u0c40', nav_facts:'\u0c35\u0c3e\u0c38\u0c4d\u0c24\u0c35\u0c3e\u0c32\u0c41', nav_stats:'\u0c17\u0c23\u0c3e\u0c02\u0c15\u0c3e\u0c32\u0c41',
      nav_events:'\u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c4d\u0c30\u0c2e\u0c3e\u0c32\u0c41', nav_map:'\u0c2e\u0c4d\u0c2f\u0c3e\u0c2a\u0c4d', nav_polls:'\u0c2a\u0c4b\u0c32\u0c4d\u0c38\u0c4d',
      nav_recipes:'\u0c35\u0c02\u0c1f\u0c15\u0c3e\u0c32\u0c41', nav_achievements:'\u0c35\u0c3f\u0c1c\u0c2f\u0c3e\u0c32\u0c41',
      nav_videos:'\u0c35\u0c40\u0c21\u0c3f\u0c2f\u0c4b\u0c32\u0c41', nav_share:'QR \u0c15\u0c4b\u0c21\u0c4d \u0c37\u0c47\u0c30\u0c4d', nav_contact:'\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
      nav_join:'\u0c1a\u0c47\u0c30\u0c02\u0c21\u0c3f', nav_about:'\u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f',
      // Sign out
      signout:'\u0c28\u0c3f\u0c37\u0c4d\u0c15\u0c4d\u0c30\u0c2e\u0c3f\u0c02\u0c1a\u0c41',
      // Login page
      login_title:'\u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c43\u0c15\u0c4d\u0c37\u0c02',
      login_sub:'\u0c2a\u0c4d\u0c30\u0c48\u0c35\u0c47\u0c1f\u0c4d \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32 \u00b7 \u0c15\u0c4a\u0c28\u0c38\u0c3e\u0c17\u0c3f\u0c02\u0c1a\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c2a\u0c3e\u0c38\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c21\u0c4d \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f',
      login_placeholder:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c2a\u0c3e\u0c38\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c21\u0c4d \u0c28\u0c2e\u0c4b\u0c26\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f',
      login_btn:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32\u0c32\u0c4b\u0c15\u0c3f \u0c2a\u0c4d\u0c30\u0c35\u0c47\u0c36\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f \u2192',
      login_note:'\u0c08 \u0c38\u0c48\u0c1f\u0c4d \u0c2a\u0c4d\u0c30\u0c24\u0c4d\u0c2f\u0c47\u0c15\u0c02\u0c17\u0c3e \u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c2e\u0c3e\u0c24\u0c4d\u0c30\u0c2e\u0c47.',
      // Home hero
      hero_eyebrow:'\u0c38\u0c4d\u0c35\u0c3e\u0c17\u0c24\u0c02',
      hero_title_1:'', hero_title_em:'\u0c28\u0c41\u0c15\u0c3e\u0c32', hero_title_2:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32',
      hero_tagline:'\u0c2e\u0c28 \u0c2e\u0c42\u0c32\u0c3e\u0c32\u0c28\u0c41 \u0c35\u0c47\u0c21\u0c41\u0c15 \u0c1a\u0c47\u0c38\u0c41\u0c15\u0c4a\u0c35\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f, \u0c2e\u0c28 \u0c15\u0c25\u0c32\u0c28\u0c41 \u0c2d\u0c26\u0c4d\u0c30\u0c2a\u0c30\u0c1a\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f, \u0c24\u0c30\u0c3e\u0c32 \u0c05\u0c02\u0c24\u0c1f\u0c3e \u0c05\u0c28\u0c41\u0c38\u0c02\u0c27\u0c3e\u0c28\u0c02\u0c17\u0c3e \u0c09\u0c02\u0c21\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c12\u0c15 \u0c2a\u0c4d\u0c30\u0c48\u0c35\u0c47\u0c1f\u0c4d \u0c38\u0c4d\u0c25\u0c32\u0c02.',
      stat1_lbl:'\u0c24\u0c30\u0c3e\u0c32\u0c41', stat2_lbl:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c2d\u0c4d\u0c2f\u0c41\u0c32\u0c41', stat3_lbl:'\u0c2a\u0c02\u0c1a\u0c41\u0c15\u0c41\u0c28\u0c4d\u0c28 \u0c15\u0c25\u0c32\u0c41',
      about_title:'\u0c2e\u0c28 \u0c35\u0c47\u0c30\u0c4d\u0c32\u0c41 \u0c32\u0c4b\u0c24\u0c41\u0c17\u0c3e \u0c09\u0c28\u0c4d\u0c28\u0c3e\u0c2f\u0c3f',
      about_p1:'\u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c2b\u0c4d\u0c2f\u0c3e\u0c2e\u0c3f\u0c32\u0c40 \u0c1f\u0c4d\u0c30\u0c40\u0c15\u0c3f \u0c38\u0c4d\u0c35\u0c3e\u0c17\u0c24\u0c02 \u2014 \u0c2e\u0c28 \u0c2a\u0c42\u0c30\u0c4d\u0c35\u0c40\u0c15\u0c41\u0c32\u0c28\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c35\u0c3e\u0c30\u0c38\u0c24\u0c4d\u0c35\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c2d\u0c26\u0c4d\u0c30\u0c2a\u0c30\u0c1a\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c05\u0c02\u0c15\u0c3f\u0c24\u0c2e\u0c48\u0c28 \u0c2a\u0c4d\u0c30\u0c48\u0c35\u0c47\u0c1f\u0c4d \u0c38\u0c2d\u0c4d\u0c2f\u0c24\u0c4d\u0c35 \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32.',
      about_p2:'\u0c08 \u0c38\u0c48\u0c1f\u0c4d \u0c2e\u0c28\u0c02 \u0c0e\u0c35\u0c30\u0c4b \u0c05\u0c28\u0c47 \u0c26\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c1c\u0c40\u0c35\u0c02\u0c24\u0c2e\u0c48\u0c28 \u0c30\u0c3f\u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41.',
      about_p3:'\u0c2a\u0c4d\u0c30\u0c24\u0c3f \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c2d\u0c4d\u0c2f\u0c41\u0c21\u0c42 \u0c38\u0c39\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2e\u0c28\u0c3f \u0c06\u0c39\u0c4d\u0c35\u0c3e\u0c28\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c02.',
      recent_updates:'\u0c24\u0c3e\u0c1c\u0c3e \u0c05\u0c2a\u0c4d\u200c\u0c21\u0c47\u0c1f\u0c4d\u200c\u0c32\u0c41',
      card_tree_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c43\u0c15\u0c4d\u0c37\u0c02', card_tree_desc:'\u0c2e\u0c28 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c02\u0c2c\u0c02\u0c27\u0c3e\u0c32\u0c41, \u0c36\u0c3e\u0c16\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c35\u0c02\u0c36\u0c3e\u0c35\u0c33\u0c3f\u0c28\u0c3f \u0c05\u0c28\u0c4d\u0c35\u0c47\u0c37\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.', card_tree_arrow:'\u0c35\u0c43\u0c15\u0c4d\u0c37\u0c02 \u0c1a\u0c42\u0c21\u0c02\u0c21\u0c3f \u2192',
      card_history_title:'\u0c2e\u0c28 \u0c1a\u0c30\u0c3f\u0c24\u0c4d\u0c30', card_history_desc:'\u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c15\u0c25\u0c32\u0c41, \u0c2e\u0c48\u0c32\u0c41\u0c30\u0c3e\u0c33\u0c4d\u0c33\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c35\u0c3e\u0c30\u0c38\u0c24\u0c4d\u0c35\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c1a\u0c26\u0c35\u0c02\u0c21\u0c3f.', card_history_arrow:'\u0c2e\u0c30\u0c3f\u0c02\u0c24 \u0c1a\u0c26\u0c35\u0c02\u0c21\u0c3f \u2192',
      card_gallery_title:'\u0c2b\u0c4b\u0c1f\u0c4b \u0c17\u0c4d\u0c2f\u0c3e\u0c32\u0c30\u0c40', card_gallery_desc:'\u0c38\u0c02\u0c35\u0c24\u0c4d\u0c38\u0c30\u0c3e\u0c32 \u0c1c\u0c4d\u0c1e\u0c3e\u0c2a\u0c15\u0c3e\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c2b\u0c4b\u0c1f\u0c4b\u0c32\u0c41 \u0c1a\u0c42\u0c21\u0c02\u0c21\u0c3f.', card_gallery_arrow:'\u0c2b\u0c4b\u0c1f\u0c4b\u0c32\u0c41 \u0c1a\u0c42\u0c21\u0c02\u0c21\u0c3f \u2192',
      card_contact_title:'\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f', card_contact_desc:'\u0c2e\u0c40 \u0c38\u0c4d\u0c35\u0c02\u0c24 \u0c15\u0c25\u0c32\u0c41, \u0c2b\u0c4b\u0c1f\u0c4b\u0c32\u0c41 \u0c32\u0c47\u0c26\u0c3e \u0c38\u0c30\u0c3f\u0c26\u0c3f\u0c26\u0c4d\u0c26\u0c41\u0c32\u0c41 \u0c38\u0c39\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.', card_contact_arrow:'\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f \u2192',
      // History
      hist_eyebrow:'\u0c2e\u0c28 \u0c15\u0c25', hist_title_em:'\u0c28\u0c41\u0c15\u0c3e\u0c32', hist_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c1a\u0c30\u0c3f\u0c24\u0c4d\u0c30',
      hist_sub:'\u0c15\u0c3e\u0c32\u0c02 \u0c17\u0c41\u0c02\u0c21\u0c3e \u0c12\u0c15 \u0c2a\u0c4d\u0c30\u0c2f\u0c3e\u0c23\u0c02 \u2014 \u0c2e\u0c28\u0c32\u0c28\u0c41 \u0c24\u0c40\u0c30\u0c4d\u0c1a\u0c3f\u0c26\u0c3f\u0c26\u0c4d\u0c26\u0c3f\u0c28 \u0c2e\u0c48\u0c32\u0c41\u0c30\u0c3e\u0c33\u0c4d\u0c33\u0c41, \u0c15\u0c4d\u0c37\u0c23\u0c3e\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c1c\u0c4d\u0c1e\u0c3e\u0c2a\u0c15\u0c3e\u0c32\u0c41.',
      hist_quote:'\u201c\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c15\u0c25 \u0c12\u0c15 \u0c28\u0c26\u0c3f \u2014 \u0c05\u0c26\u0c3f \u0c15\u0c3e\u0c32\u0c02 \u0c17\u0c41\u0c02\u0c21\u0c3e \u0c2a\u0c4d\u0c30\u0c35\u0c39\u0c3f\u0c38\u0c4d\u0c24\u0c41\u0c02\u0c26\u0c3f.\u201d',
      add_story:'+ \u0c15\u0c25 \u0c1c\u0c4b\u0c21\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
      // Gallery
      gal_eyebrow:'\u0c1c\u0c4d\u0c1e\u0c3e\u0c2a\u0c15\u0c3e\u0c32\u0c41', gal_title_em:'\u0c28\u0c41\u0c15\u0c3e\u0c32', gal_title:'\u0c2b\u0c4b\u0c1f\u0c4b \u0c17\u0c4d\u0c2f\u0c3e\u0c32\u0c30\u0c40',
      gal_sub:'\u0c38\u0c02\u0c35\u0c24\u0c4d\u0c38\u0c30\u0c3e\u0c32\u0c41\u0c17\u0c3e \u0c05\u0c2e\u0c42\u0c32\u0c4d\u0c2f\u0c2e\u0c48\u0c28 \u0c15\u0c4d\u0c37\u0c23\u0c3e\u0c32\u0c41, \u0c35\u0c47\u0c21\u0c41\u0c15\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c2e\u0c41\u0c16\u0c3e\u0c32 \u0c26\u0c43\u0c36\u0c4d\u0c2f \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32.',
      filter_all:'\u0c05\u0c28\u0c4d\u0c28\u0c3f \u0c2b\u0c4b\u0c1f\u0c4b\u0c32\u0c41', filter_family:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c\u0c02', filter_vintage:'\u0c35\u0c3f\u0c02\u0c1f\u0c47\u0c1c\u0c4d',
      filter_celebrations:'\u0c35\u0c47\u0c21\u0c41\u0c15\u0c32\u0c41', filter_travel:'\u0c2a\u0c4d\u0c30\u0c2f\u0c3e\u0c23\u0c02', filter_other:'\u0c07\u0c24\u0c30',
      // Facts
      facts_eyebrow:'\u0c2e\u0c40\u0c15\u0c41 \u0c24\u0c46\u0c32\u0c41\u0c38\u0c3e?', facts_title:'\u0c06\u0c38\u0c15\u0c4d\u0c24\u0c3f\u0c15\u0c30\u0c2e\u0c48\u0c28 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c3e\u0c38\u0c4d\u0c24\u0c35\u0c3e\u0c32\u0c41',
      facts_sub:'\u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c2a\u0c4d\u0c30\u0c24\u0c4d\u0c2f\u0c47\u0c15\u0c02\u0c17\u0c3e \u0c1a\u0c47\u0c38\u0c47 \u0c06\u0c38\u0c15\u0c4d\u0c24\u0c3f\u0c15\u0c30\u0c2e\u0c48\u0c28 \u0c35\u0c3f\u0c37\u0c2f\u0c3e\u0c32\u0c41.',
      filter_achievements:'\u0c35\u0c3f\u0c1c\u0c2f\u0c3e\u0c32\u0c41', filter_milestones:'\u0c2e\u0c48\u0c32\u0c41\u0c30\u0c3e\u0c33\u0c4d\u0c33\u0c41',
      filter_traditions:'\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3e\u0c2f\u0c3e\u0c32\u0c41', filter_records:'\u0c30\u0c3f\u0c15\u0c3e\u0c30\u0c4d\u0c21\u0c41\u0c32\u0c41', filter_fun:'\u0c38\u0c30\u0c26\u0c3e \u0c35\u0c3f\u0c37\u0c2f\u0c3e\u0c32\u0c41',
      // Stats
      stats_eyebrow:'\u0c38\u0c02\u0c16\u0c4d\u0c2f\u0c32\u0c4d\u0c32\u0c4b', stats_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c17\u0c23\u0c3e\u0c02\u0c15\u0c3e\u0c32\u0c41',
      stats_sub:'\u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c\u0c02\u0c32\u0c4b \u0c06\u0c38\u0c15\u0c4d\u0c24\u0c3f\u0c15\u0c30\u0c2e\u0c48\u0c28 \u0c35\u0c3f\u0c37\u0c2f\u0c3e\u0c32\u0c41.',
      // Events
      evts_eyebrow:'\u0c30\u0c3e\u0c2c\u0c4b\u0c2f\u0c47 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c4d\u0c30\u0c2e\u0c3e\u0c32\u0c41', evts_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c4d\u0c30\u0c2e\u0c3e\u0c32\u0c41',
      evts_sub:'\u0c38\u0c2e\u0c3e\u0c35\u0c47\u0c36\u0c3e\u0c32\u0c41, \u0c35\u0c47\u0c21\u0c41\u0c15\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c38\u0c2e\u0c3e\u0c35\u0c47\u0c36\u0c3e\u0c32\u0c41 \u2014 \u0c05\u0c28\u0c41\u0c38\u0c02\u0c27\u0c3e\u0c28\u0c02\u0c17\u0c3e \u0c09\u0c02\u0c21\u0c02\u0c21\u0c3f.',
      // Recipes
      rec_eyebrow:'\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3e\u0c2f', rec_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c02\u0c1f\u0c15\u0c3e\u0c32\u0c41',
      rec_sub:'\u0c24\u0c30\u0c3e\u0c32 \u0c17\u0c41\u0c02\u0c21\u0c3e \u0c05\u0c02\u0c26\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c05\u0c2e\u0c42\u0c32\u0c4d\u0c2f\u0c2e\u0c48\u0c28 \u0c35\u0c02\u0c1f\u0c15\u0c3e\u0c32\u0c41 \u2014 \u0c07\u0c02\u0c1f\u0c3f \u0c30\u0c41\u0c1a\u0c41\u0c32\u0c41.',
      // Achievements
      ach_eyebrow:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c17\u0c30\u0c4d\u0c35\u0c02', ach_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c3f\u0c1c\u0c2f\u0c3e\u0c32\u0c41',
      ach_sub:'\u0c21\u0c3f\u0c17\u0c4d\u0c30\u0c40\u0c32\u0c41, \u0c2a\u0c41\u0c30\u0c38\u0c4d\u0c15\u0c3e\u0c30\u0c3e\u0c32\u0c41, \u0c17\u0c4c\u0c30\u0c35\u0c3e\u0c32\u0c41 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c17\u0c30\u0c4d\u0c35\u0c15\u0c30\u0c2e\u0c48\u0c28 \u0c38\u0c3e\u0c27\u0c28\u0c32\u0c41.',
      // Videos
      vid_eyebrow:'\u0c1a\u0c32\u0c28\u0c1a\u0c3f\u0c24\u0c4d\u0c30\u0c3e\u0c32\u0c4d\u0c32\u0c4b \u0c1c\u0c4d\u0c1e\u0c3e\u0c2a\u0c15\u0c3e\u0c32\u0c41', vid_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c40\u0c21\u0c3f\u0c2f\u0c4b\u0c32\u0c41',
      vid_sub:'\u0c1a\u0c3f\u0c24\u0c4d\u0c30\u0c40\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c2c\u0c21\u0c3f\u0c28 \u0c05\u0c2e\u0c42\u0c32\u0c4d\u0c2f\u0c2e\u0c48\u0c28 \u0c15\u0c4d\u0c37\u0c23\u0c3e\u0c32\u0c41 \u2014 \u0c2e\u0c28 \u0c15\u0c25 \u0c1a\u0c42\u0c21\u0c02\u0c21\u0c3f.',
      // Map
      map_eyebrow:'\u0c2e\u0c28\u0c02 \u0c0e\u0c15\u0c4d\u0c15\u0c21 \u0c09\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41', map_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c2e\u0c4d\u0c2f\u0c3e\u0c2a\u0c4d',
      map_sub:'\u0c2a\u0c4d\u0c30\u0c2a\u0c02\u0c1a\u0c02 \u0c05\u0c02\u0c24\u0c1f\u0c3e \u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c2d\u0c4d\u0c2f\u0c41\u0c32\u0c41 \u0c0e\u0c15\u0c4d\u0c15\u0c21 \u0c09\u0c28\u0c4d\u0c28\u0c3e\u0c30\u0c4b \u0c1a\u0c42\u0c21\u0c02\u0c21\u0c3f.',
      // Polls
      poll_eyebrow:'\u0c2e\u0c40 \u0c05\u0c2d\u0c3f\u0c2a\u0c4d\u0c30\u0c3e\u0c2f\u0c02 \u0c37\u0c47\u0c30\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f', poll_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c2a\u0c4b\u0c32\u0c4d\u0c38\u0c4d',
      poll_sub:'\u0c2a\u0c4d\u0c30\u0c24\u0c3f \u0c17\u0c33\u0c41 \u0c2e\u0c41\u0c16\u0c4d\u0c2f\u0c2e\u0c47 \u2014 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c3f\u0c37\u0c2f\u0c3e\u0c32\u0c2a\u0c48 \u0c2e\u0c40 \u0c05\u0c2d\u0c3f\u0c2a\u0c4d\u0c30\u0c3e\u0c2f\u0c02 \u0c37\u0c47\u0c30\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
      // QR
      qr_eyebrow:'\u0c38\u0c48\u0c1f\u0c4d \u0c37\u0c47\u0c30\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f', qr_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c QR \u0c15\u0c4b\u0c21\u0c4d',
      qr_sub:'\u0c2e\u0c30\u0c3f\u0c02\u0c24 \u0c2e\u0c02\u0c26\u0c3f \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c2d\u0c4d\u0c2f\u0c41\u0c32\u0c28\u0c41 \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32\u0c15\u0c41 \u0c24\u0c30\u0c32\u0c42 \u0c38\u0c4d\u0c15\u0c4d\u0c2f\u0c3e\u0c28\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f.',
      // Tree
      tree_eyebrow:'\u0c2e\u0c28 \u0c35\u0c47\u0c30\u0c41\u0c32\u0c41', tree_title_em:'\u0c28\u0c41\u0c15\u0c3e\u0c32', tree_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c43\u0c15\u0c4d\u0c37\u0c02',
      tree_sub:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c2d\u0c4d\u0c2f\u0c41\u0c28\u0c3f \u0c2e\u0c4b\u0c38\u0c4d \u0c1a\u0c47\u0c38\u0c3f \u0c35\u0c3e\u0c30\u0c3f \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 \u0c15\u0c28\u0c41\u0c17\u0c4a\u0c02\u0c21\u0c3f.',
      'btn-fit':'\u0c38\u0c4d\u0c15\u0c4d\u0c30\u0c40\u0c28\u0c4d\u0c15\u0c41 \u0c38\u0c30\u0c3f\u0c2a\u0c4e\u0c02\u0c1a\u0c02\u0c21\u0c3f', 'btn-reset':'\u0c30\u0c40\u0c38\u0c46\u0c1f\u0c4d \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f',
      // Contact
      cont_eyebrow:'\u0c38\u0c39\u0c15\u0c30\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f', cont_title:'\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
      cont_sub:'\u0c12\u0c15 \u0c15\u0c25, \u0c2b\u0c4b\u0c1f\u0c4b \u0c38\u0c2e\u0c30\u0c4d\u0c2a\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f, \u0c32\u0c47\u0c26\u0c3e \u0c38\u0c30\u0c3f\u0c26\u0c3f\u0c26\u0c4d\u0c26\u0c41\u0c32\u0c41 \u0c38\u0c42\u0c1a\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.',
      form_fn:'\u0c2e\u0c4a\u0c26\u0c1f\u0c3f \u0c2a\u0c47\u0c30\u0c41', form_ln:'\u0c1a\u0c3f\u0c35\u0c30\u0c3f \u0c2a\u0c47\u0c30\u0c41', form_email:'\u0c07\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d',
      form_subj:'\u0c35\u0c3f\u0c37\u0c2f\u0c02', form_msg:'\u0c38\u0c02\u0c26\u0c47\u0c36\u0c02', form_btn:'\u0c38\u0c02\u0c26\u0c47\u0c36\u0c02 \u0c2a\u0c02\u0c2a\u0c02\u0c21\u0c3f',
      // Join Tree page
      join_eyebrow:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c\u0c02\u0c32\u0c4b \u0c1a\u0c47\u0c30\u0c02\u0c21\u0c3f', join_title:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c35\u0c43\u0c15\u0c4d\u0c37\u0c02\u0c32\u0c4b \u0c1a\u0c47\u0c30\u0c02\u0c21\u0c3f',
      join_sub:'\u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32\u0c28\u0c41 \u0c28\u0c3f\u0c30\u0c4d\u0c2e\u0c3f\u0c02\u0c1a\u0c21\u0c02\u0c32\u0c4b \u0c38\u0c39\u0c3e\u0c2f\u0c2a\u0c21\u0c02\u0c21\u0c3f.',
      join_personal:'\u0c35\u0c4d\u0c2f\u0c15\u0c4d\u0c24\u0c3f\u0c17\u0c24 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41', join_connections:'\u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c05\u0c28\u0c41\u0c38\u0c02\u0c27\u0c3e\u0c28\u0c3e\u0c32\u0c41', join_contact_details:'\u0c38\u0c02\u0c2a\u0c4d\u0c30\u0c26\u0c3f\u0c02\u0c2a\u0c41 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41',
      join_firstname:'\u0c2e\u0c4a\u0c26\u0c1f\u0c3f \u0c2a\u0c47\u0c30\u0c41', join_lastname:'\u0c1a\u0c3f\u0c35\u0c30\u0c3f \u0c2a\u0c47\u0c30\u0c41', join_dob:'\u0c2a\u0c41\u0c1f\u0c4d\u0c1f\u0c3f\u0c28 \u0c24\u0c47\u0c26\u0c40',
      join_gender:'\u0c32\u0c3f\u0c02\u0c17\u0c02', join_city:'\u0c2e\u0c40\u0c30\u0c41 \u0c28\u0c3f\u0c35\u0c38\u0c3f\u0c02\u0c1a\u0c47 \u0c28\u0c17\u0c30\u0c02', join_occ:'\u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f', join_bio:'\u0c2e\u0c40 \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f \u0c38\u0c02\u0c15\u0c4d\u0c37\u0c3f\u0c2a\u0c4d\u0c24 \u0c35\u0c3f\u0c35\u0c30\u0c23',
      join_father:'\u0c24\u0c02\u0c21\u0c4d\u0c30\u0c3f \u0c2a\u0c42\u0c30\u0c4d\u0c24\u0c3f \u0c2a\u0c47\u0c30\u0c41', join_mother:'\u0c24\u0c32\u0c4d\u0c32\u0c3f \u0c2a\u0c42\u0c30\u0c4d\u0c24\u0c3f \u0c2a\u0c47\u0c30\u0c41', join_spouse:'\u0c1c\u0c40\u0c35\u0c3f\u0c24 \u0c2d\u0c3e\u0c17\u0c38\u0c4d\u0c35\u0c3e\u0c2e\u0c3f \u0c2a\u0c42\u0c30\u0c4d\u0c24\u0c3f \u0c2a\u0c47\u0c30\u0c41',
      join_anniversary:'\u0c35\u0c3f\u0c35\u0c3e\u0c39 \u0c35\u0c3e\u0c30\u0c4d\u0c37\u0c3f\u0c15\u0c4b\u0c24\u0c4d\u0c38\u0c35 \u0c24\u0c47\u0c26\u0c40', join_children:'\u0c2a\u0c3f\u0c32\u0c4d\u0c32\u0c32 \u0c2a\u0c47\u0c30\u0c4d\u0c32\u0c41', join_siblings:'\u0c24\u0c4b\u0c2c\u0c41\u0c1f\u0c4d\u0c1f\u0c41\u0c35\u0c41\u0c32 \u0c2a\u0c47\u0c30\u0c4d\u0c32\u0c41',
      join_wa:'\u0c35\u0c3e\u0c1f\u0c4d\u0c38\u0c3e\u0c2a\u0c4d \u0c28\u0c02\u0c2c\u0c30\u0c4d', join_email:'\u0c07\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d \u0c1a\u0c3f\u0c30\u0c41\u0c28\u0c3e\u0c2e\u0c3e', join_photo:'\u0c2b\u0c4b\u0c1f\u0c4b URL (\u0c10\u0c1a\u0c4d\u0c1b\u0c3f\u0c15\u0c02)',
      join_photo_note:'Google \u0c2b\u0c4b\u0c1f\u0c4b\u0c32\u0c15\u0c41 \u0c2b\u0c4b\u0c1f\u0c4b \u0c05\u0c2a\u0c4d\u200c\u0c32\u0c4b\u0c21\u0c4d \u0c1a\u0c47\u0c38\u0c3f, \u0c37\u0c47\u0c30\u0c4d \u0c1a\u0c47\u0c38\u0c3f, \u0c32\u0c3f\u0c02\u0c15\u0c4d \u0c07\u0c15\u0c4d\u0c15\u0c21 \u0c05\u0c24\u0c3f\u0c15\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
      join_note:'\u0c2e\u0c40\u0c15\u0c41 \u0c28\u0c1a\u0c4d\u0c1a\u0c3f\u0c28\u0c26\u0c3f \u0c2a\u0c02\u0c1a\u0c41\u0c15\u0c4a\u0c02\u0c21\u0c3f.',
      join_submit_note:'\u0c2e\u0c40\u0c30\u0c41 \u0c15\u0c4d\u0c30\u0c3f\u0c02\u0c26 \u0c15\u0c4d\u0c32\u0c3f\u0c15\u0c4d \u0c1a\u0c47\u0c38\u0c3f\u0c28\u0c2a\u0c4d\u0c2a\u0c41\u0c21\u0c41, \u0c2e\u0c40 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 \u0c35\u0c3e\u0c1f\u0c4d\u0c38\u0c3e\u0c2a\u0c4d \u0c32\u0c47\u0c26\u0c3e \u0c07\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d\u0c32\u0c4b \u0c24\u0c46\u0c30\u0c41\u0c1a\u0c41\u0c15\u0c41\u0c02\u0c1f\u0c3e\u0c2f\u0c3f.',
      join_send_wa:'\u0c35\u0c3e\u0c1f\u0c4d\u0c38\u0c3e\u0c2a\u0c4d \u0c26\u0c4d\u0c35\u0c3e\u0c30\u0c3e \u0c2a\u0c02\u0c2a\u0c02\u0c21\u0c3f', join_send_email:'\u0c07\u0c2e\u0c46\u0c2f\u0c3f\u0c32\u0c4d \u0c26\u0c4d\u0c35\u0c3e\u0c30\u0c3e \u0c2a\u0c02\u0c2a\u0c02\u0c21\u0c3f',
      // About page
      about_eyebrow:'\u0c08 \u0c2a\u0c4d\u0c30\u0c3e\u0c1c\u0c46\u0c15\u0c4d\u0c1f\u0c4d \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f', about_title_str:'\u0c08 \u0c2a\u0c4d\u0c30\u0c3e\u0c1c\u0c46\u0c15\u0c4d\u0c1f\u0c4d \u0c17\u0c41\u0c30\u0c3f\u0c02\u0c1a\u0c3f',
      about_sub:'\u0c28\u0c41\u0c15\u0c3e\u0c32 \u0c15\u0c41\u0c1f\u0c41\u0c02\u0c2c \u0c38\u0c02\u0c17\u0c4d\u0c30\u0c39\u0c36\u0c3e\u0c32 \u0c35\u0c46\u0c28\u0c41\u0c15 \u0c15\u0c25.',
      about_coming_soon:'\u0c05\u0c2c\u0c4c\u0c1f\u0c4d \u0c2a\u0c47\u0c1c\u0c40 \u0c24\u0c4d\u0c35\u0c30\u0c32\u0c4b \u0c35\u0c38\u0c4d\u0c24\u0c41\u0c02\u0c26\u0c3f', about_coming_sub:'\u0c28\u0c3f\u0c30\u0c4d\u0c35\u0c3e\u0c39\u0c15\u0c41\u0c21\u0c41 \u0c24\u0c4d\u0c35\u0c30\u0c32\u0c4b \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41 \u0c1c\u0c4b\u0c21\u0c3f\u0c38\u0c4d\u0c24\u0c3e\u0c30\u0c41.',
      // Footer
      footer_private:'\u0c2a\u0c4d\u0c30\u0c48\u0c35\u0c47\u0c1f\u0c4d & \u0c2a\u0c3e\u0c38\u0c4d\u200c\u0c35\u0c30\u0c4d\u0c21\u0c4d \u0c30\u0c15\u0c4d\u0c37\u0c3f\u0c24\u0c02 \u00b7 \u0c2a\u0c4d\u0c30\u0c47\u0c2e\u0c24\u0c4b \u0c24\u0c2f\u0c3e\u0c30\u0c41 \u0c1a\u0c47\u0c38\u0c3e\u0c02',
    },
  };

  const NAV_MAP = {
    'home.html':'nav_home','tree.html':'nav_tree','history.html':'nav_history',
    'gallery.html':'nav_gallery','facts.html':'nav_facts','stats.html':'nav_stats',
    'events.html':'nav_events','map.html':'nav_map','polls.html':'nav_polls',
    'recipes.html':'nav_recipes','achievements.html':'nav_achievements',
    'videos.html':'nav_videos','qr.html':'nav_share','contact.html':'nav_contact',
    'join.html':'nav_join','about.html':'nav_about'
  };

  const PAGE_KEYS = {
    'home.html':    { eyebrow:'hero_eyebrow', p:'hero_tagline', extra:'home' },
    'history.html': { eyebrow:'hist_eyebrow', p:'hist_sub', extra:'history' },
    'gallery.html': { eyebrow:'gal_eyebrow',  p:'gal_sub',  extra:'gallery' },
    'facts.html':   { eyebrow:'facts_eyebrow',p:'facts_sub', extra:'facts' },
    'tree.html':    { eyebrow:'tree_eyebrow', p:'tree_sub',  extra:'tree' },
    'contact.html': { eyebrow:'cont_eyebrow', p:'cont_sub',  extra:'contact' },
    'stats.html':   { eyebrow:'stats_eyebrow',p:'stats_sub', extra:'stats' },
    'events.html':  { eyebrow:'evts_eyebrow', p:'evts_sub',  extra:'events' },
    'recipes.html': { eyebrow:'rec_eyebrow',  p:'rec_sub',   extra:'recipes' },
    'achievements.html':{ eyebrow:'ach_eyebrow',p:'ach_sub', extra:'achievements' },
    'videos.html':  { eyebrow:'vid_eyebrow',  p:'vid_sub',   extra:'videos' },
    'map.html':     { eyebrow:'map_eyebrow',  p:'map_sub',   extra:'map' },
    'polls.html':   { eyebrow:'poll_eyebrow', p:'poll_sub',  extra:'polls' },
    'qr.html':      { eyebrow:'qr_eyebrow',   p:'qr_sub',    extra:'qr' },
    'join.html':    { eyebrow:'join_eyebrow',  p:'join_sub',  extra:'join' },
    'about.html':   { eyebrow:'about_eyebrow', p:'about_sub', extra:'about' },
  };

  function setText(sel, val){ if(!val) return; const el = document.querySelector(sel); if(el) el.textContent = val; }

  function applyLang(lang){
    localStorage.setItem(LK, lang);
    const t = T[lang] || T.en;
    const page = location.pathname.split('/').pop() || 'home.html';

    // 1. Nav links
    document.querySelectorAll('nav .nav-links a').forEach(a => {
      const key = NAV_MAP[a.getAttribute('href')];
      if(key && t[key]) a.textContent = t[key];
    });

    // 2. Sign out buttons
    document.querySelectorAll('.nav-logout').forEach(b => {
      if(b.classList.contains('nk-dm') || b.classList.contains('nk-lang') ||
         b.classList.contains('nk-search-btn') || b.classList.contains('nk-burger')) return;
      if(b.textContent.trim().length > 0) b.textContent = t.signout;
    });

    // 3. Language toggle button text
    document.querySelectorAll('.nk-lang').forEach(b => b.textContent = lang==='te' ? 'EN' : '\u0c24\u0c46');

    // 4. Page hero
    const pk = PAGE_KEYS[page];
    if(pk){
      const hero = document.querySelector('.page-hero, .hero-banner, .join-hero, .about-hero');
      if(hero){
        const eyebrow = hero.querySelector('.eyebrow');
        if(eyebrow && t[pk.eyebrow]) eyebrow.textContent = t[pk.eyebrow];
        const p = hero.querySelector('p, .hero-tagline');
        if(p && t[pk.p]) p.textContent = t[pk.p];
        const h1 = hero.querySelector('h1, .hero-title');
        if(h1){
          const titleKey = pk.extra + '_title';
          const emKey    = pk.extra + '_title_em';
          if(t[emKey]){
            const em = h1.querySelector('em');
            if(em){
              const t1 = t[pk.extra+'_title_1'] || '';
              const t2 = t[pk.extra+'_title_2'] || (t[titleKey]||'');
              h1.innerHTML = (t1 ? t1+' ' : '') + '<em>'+t[emKey]+'</em>' + (t2 ? '<br>'+t2 : '');
            } else {
              if(t[titleKey]) h1.textContent = t[titleKey];
            }
          } else if(t[titleKey]){
            h1.textContent = t[titleKey];
          }
        }
      }
    }

    // 5. Home page
    if(page === 'home.html'){
      setText('#stat1lbl', t.stat1_lbl); setText('#stat2lbl', t.stat2_lbl); setText('#stat3lbl', t.stat3_lbl);
      setText('#aboutTitle', t.about_title); setText('#aboutP1', t.about_p1); setText('#aboutP2', t.about_p2); setText('#aboutP3', t.about_p3);
      document.querySelectorAll('.recent-updates h2').forEach(el => el.textContent = t.recent_updates);
      const cards = document.querySelectorAll('.quick-card');
      const cardKeys = [
        {title:'card_tree_title', desc:'card_tree_desc', arrow:'card_tree_arrow'},
        {title:'card_history_title', desc:'card_history_desc', arrow:'card_history_arrow'},
        {title:'card_gallery_title', desc:'card_gallery_desc', arrow:'card_gallery_arrow'},
        {title:'card_contact_title', desc:'card_contact_desc', arrow:'card_contact_arrow'},
      ];
      cards.forEach((card, i) => {
        if(!cardKeys[i]) return;
        const ck = cardKeys[i];
        const titleEl = card.querySelector('.quick-card-title');
        const descEl  = card.querySelector('.quick-card-desc');
        const arrEl   = card.querySelector('.quick-card-arrow');
        if(titleEl && t[ck.title]) titleEl.textContent = t[ck.title];
        if(descEl  && t[ck.desc])  descEl.textContent  = t[ck.desc];
        if(arrEl   && t[ck.arrow]) arrEl.textContent   = t[ck.arrow];
      });
    }

    // 6. History page
    if(page === 'history.html'){
      const addStoryBtn = document.querySelector('.add-story-bar a, .btn-outline-sm');
      if(addStoryBtn && addStoryBtn.textContent.includes('Story')) addStoryBtn.textContent = t.add_story;
      const quote = document.querySelector('.history-intro');
      if(quote) quote.textContent = t.hist_quote;
    }

    // 7. Gallery filter buttons
    if(page === 'gallery.html'){
      const filterMap = { 'all':'filter_all','family':'filter_family','vintage':'filter_vintage','celebrations':'filter_celebrations','travel':'filter_travel','other':'filter_other' };
      document.querySelectorAll('.filter-btn').forEach(btn => {
        const key = btn.getAttribute('data-filter-key');
        if(key && t[filterMap[key]||key]) btn.textContent = t[filterMap[key]||key];
      });
    }

    // 8. Facts filter buttons
    if(page === 'facts.html'){
      const filterMap = { 'all':'filter_all','Achievement':'filter_achievements','Milestone':'filter_milestones','Tradition':'filter_traditions','Record':'filter_records','Fun Fact':'filter_fun' };
      document.querySelectorAll('.filter-btn').forEach(btn => {
        const key = btn.getAttribute('data-filter-key');
        if(key && t[filterMap[key]||key]) btn.textContent = t[filterMap[key]||key];
      });
    }

    // 9. Tree page buttons
    if(page === 'tree.html'){
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if(t[key]) el.textContent = t[key];
      });
    }

    // 10. Contact form labels
    if(page === 'contact.html'){
      document.querySelectorAll('label[for="fname"]').forEach(l => l.textContent = t.form_fn);
      document.querySelectorAll('label[for="lname"]').forEach(l => l.textContent = t.form_ln);
      document.querySelectorAll('label[for="email"]').forEach(l => l.textContent = t.form_email);
      document.querySelectorAll('label[for="subject"]').forEach(l => l.textContent = t.form_subj);
      document.querySelectorAll('label[for="message"]').forEach(l => l.textContent = t.form_msg);
      const submitBtn = document.querySelector('.submit-btn');
      if(submitBtn) submitBtn.textContent = t.form_btn;
    }

    // 11. Footer
    document.querySelectorAll('footer').forEach(f => {
      const nodes = [...f.childNodes];
      nodes.forEach(n => {
        if(n.nodeType === 3 && n.textContent.includes('Private')){
          n.textContent = ' \u00b7 ' + t.footer_private;
        }
      });
    });

    // 12. Join Tree page
    if(page === 'join.html'){
      var jLabels = {
        jFirstName:t.join_firstname, jLastName:t.join_lastname,
        jDOB:t.join_dob, jGender:t.join_gender,
        jCity:t.join_city, jOccupation:t.join_occ, jBio:t.join_bio,
        jFather:t.join_father, jMother:t.join_mother,
        jSpouse:t.join_spouse, jAnniversary:t.join_anniversary,
        jChildren:t.join_children, jSiblings:t.join_siblings,
        jWhatsapp:t.join_wa, jEmail:t.join_email, jPhoto:t.join_photo
      };
      Object.keys(jLabels).forEach(function(id){
        if(!jLabels[id]) return;
        var el = document.getElementById(id);
        if(!el) return;
        var field = el.closest('.join-field');
        var lbl = field && field.querySelector('label');
        if(lbl) lbl.textContent = jLabels[id];
      });
      document.querySelectorAll('button.btn-wa').forEach(function(b){
        if(t.join_send_wa) b.innerHTML = '<span style="font-size:1.1rem;">&#128241;</span> ' + t.join_send_wa;
      });
      document.querySelectorAll('button.btn-email').forEach(function(b){
        if(t.join_send_email) b.innerHTML = '<span style="font-size:1.1rem;">&#9993;</span> ' + t.join_send_email;
      });
      var noteEl = document.querySelector('.required-note');
      if(noteEl && t.join_note) noteEl.textContent = t.join_note;
      var submitNote = document.querySelector('.join-submit-area p');
      if(submitNote && t.join_submit_note) submitNote.textContent = t.join_submit_note;
    }

    // 13. About page
    if(page === 'about.html'){
      var emptyEl = document.querySelector('.empty-about h3');
      if(emptyEl && t.about_coming_soon) emptyEl.textContent = t.about_coming_soon;
      var emptySubEl = document.querySelector('.empty-about p');
      if(emptySubEl && t.about_coming_sub) emptySubEl.textContent = t.about_coming_sub;
    }

    // 14. Login page
    if(page === 'index.html'){
      const title = document.querySelector('.ltitle, h1');
      const sub   = document.querySelector('.lsub');
      const inp   = document.querySelector('input[type="password"]');
      const btn   = document.querySelector('.btnp');
      if(title) title.textContent  = t.login_title;
      if(sub)   sub.textContent    = t.login_sub;
      if(inp)   inp.placeholder    = t.login_placeholder;
      if(btn)   btn.textContent    = t.login_btn;
    }
  }

  // ── Init ──
  const savedLang = localStorage.getItem(LK) || 'en';

  // Build language toggle button
  document.querySelectorAll('.nk-lang').forEach(btn => {
    btn.textContent = savedLang === 'te' ? 'EN' : '\u0c24\u0c46';
    btn.addEventListener('click', () => {
      const next = localStorage.getItem(LK) === 'te' ? 'en' : 'te';
      applyLang(next);
    });
  });

  if(savedLang !== 'en') applyLang(savedLang);

})();
