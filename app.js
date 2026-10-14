(() => {
  'use strict';
  const config = window.TESTER_SITE_CONFIG || {};
  const endpoint = typeof config.formEndpoint === 'string' ? config.formEndpoint.trim() : '';
  const isConfigured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
  const privacyEmail = typeof config.privacyContactEmail === 'string' ? config.privacyContactEmail.trim() : '';
  const hasPrivacyContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyEmail);
  const isLive = isConfigured && hasPrivacyContact;
  document.querySelectorAll('#year').forEach(node => { node.textContent = String(new Date().getFullYear()); });
  document.querySelectorAll('.privacy-email').forEach(node => {
    if (hasPrivacyContact) {
      const a = document.createElement('a'); a.href = 'mailto:' + privacyEmail; a.textContent = privacyEmail;
      node.replaceChildren(a);
    }
  });
  const warning = document.querySelector('#privacy-warning');
  if (warning && isLive) warning.hidden = true;
  const form = document.querySelector('#tester-form');
  if (!form) return;

  // The list intentionally includes an Other/model-entry path so no device is excluded.
  const catalog = {
    'Samsung': {
      'Phone': ['Galaxy S26', 'Galaxy S26+', 'Galaxy S26 Ultra', 'Galaxy S25', 'Galaxy S25+', 'Galaxy S25 Ultra', 'Galaxy S25 FE', 'Galaxy S24', 'Galaxy S24+', 'Galaxy S24 Ultra', 'Galaxy S24 FE', 'Galaxy S23', 'Galaxy S23+', 'Galaxy S23 Ultra', 'Galaxy S23 FE', 'Galaxy S22', 'Galaxy S22+', 'Galaxy S22 Ultra', 'Galaxy S21 series', 'Galaxy S20 series', 'Galaxy A56', 'Galaxy A55', 'Galaxy A54', 'Galaxy A36', 'Galaxy A35', 'Galaxy A34', 'Galaxy A26', 'Galaxy A25', 'Galaxy A24', 'Galaxy A16', 'Galaxy A15', 'Galaxy A14', 'Galaxy M series'],
      'Tablet': ['Galaxy Tab S11', 'Galaxy Tab S11 Ultra', 'Galaxy Tab S10+', 'Galaxy Tab S10 Ultra', 'Galaxy Tab S10 FE', 'Galaxy Tab S9', 'Galaxy Tab S9+', 'Galaxy Tab S9 Ultra', 'Galaxy Tab S9 FE', 'Galaxy Tab S8 series', 'Galaxy Tab S7 series', 'Galaxy Tab A9', 'Galaxy Tab A9+', 'Galaxy Tab A series'],
      'Foldable': ['Galaxy Z Fold7', 'Galaxy Z Fold6', 'Galaxy Z Fold5', 'Galaxy Z Fold4', 'Galaxy Z Flip7', 'Galaxy Z Flip6', 'Galaxy Z Flip5', 'Galaxy Z Flip4', 'Galaxy Z Fold / Flip (other)']
    },
    'Google': {
      'Phone': ['Pixel 10', 'Pixel 10 Pro', 'Pixel 10 Pro XL', 'Pixel 9', 'Pixel 9 Pro', 'Pixel 9 Pro XL', 'Pixel 9a', 'Pixel 8', 'Pixel 8 Pro', 'Pixel 8a', 'Pixel 7', 'Pixel 7 Pro', 'Pixel 7a', 'Pixel 6', 'Pixel 6 Pro', 'Pixel 6a', 'Pixel 5 or earlier'],
      'Tablet': ['Pixel Tablet'], 'Foldable': ['Pixel Fold', 'Pixel 9 Pro Fold', 'Pixel 10 Pro Fold']
    },
    'OnePlus': {'Phone':['OnePlus 13 / 13R','OnePlus 12 / 12R','OnePlus 11','OnePlus 10 series','OnePlus Nord series','OnePlus 9 or earlier'],'Tablet':['OnePlus Pad series'],'Foldable':['OnePlus Open']},
    'Motorola': {'Phone':['Motorola Edge series','Motorola Moto G series','Motorola Moto E series'],'Foldable':['Motorola Razr series']},
    'Xiaomi / Redmi / POCO': {'Phone':['Xiaomi 15 series','Xiaomi 14 series','Xiaomi 13 series','Redmi Note series','Redmi series','POCO F series','POCO X series','POCO M series'],'Tablet':['Xiaomi Pad series','Redmi Pad series'],'Foldable':['Xiaomi MIX Fold series','Xiaomi MIX Flip series']},
    'OPPO': {'Phone':['OPPO Find X series','OPPO Reno series','OPPO A series'],'Tablet':['OPPO Pad series'],'Foldable':['OPPO Find N series']},
    'vivo': {'Phone':['vivo X series','vivo V series','vivo Y series','iQOO series'],'Tablet':['vivo Pad series'],'Foldable':['vivo X Fold series','vivo X Flip series']},
    'Sony': {'Phone':['Xperia 1 series','Xperia 5 series','Xperia 10 series']},
    'Nothing / CMF': {'Phone':['Nothing Phone (3) series','Nothing Phone (2) series','Nothing Phone (1)','CMF Phone series']},
    'ASUS': {'Phone':['Zenfone series','ROG Phone series']},
    'HONOR': {'Phone':['HONOR Magic series','HONOR 200 / 300 / 400 series','HONOR X series'],'Tablet':['HONOR Pad series'],'Foldable':['HONOR Magic V series']},
    'HUAWEI': {'Phone':['HUAWEI P / Pura series','HUAWEI Mate series','HUAWEI nova series'],'Tablet':['HUAWEI MatePad series'],'Foldable':['HUAWEI Mate X series']},
    'Nokia / HMD': {'Phone':['Nokia G series','Nokia X series','HMD Pulse / Skyline series']},
    'Lenovo': {'Phone':['Motorola / Lenovo smartphone'],'Tablet':['Lenovo Tab series','Lenovo Yoga Tab series','Lenovo Legion Tab series']},
    'Amazon': {'Tablet':['Fire HD 8','Fire HD 10','Fire Max 11','Other Fire tablet']},
    'Other manufacturer': {}
  };
  const types = ['Phone','Tablet','Foldable','Other Android device'];
  const androidVersions = ['Android 17','Android 16','Android 15','Android 14','Android 13','Android 12','Android 11','Android 10','Android 9 or earlier','Not sure','Not applicable / customised Android'];
  const devices = document.querySelector('#devices');
  const submitBtn = document.querySelector('#submit-button');
  const readyNote = document.querySelector('#submit-ready-note');
  let sending = false;
  let submitted = false;
  function updateSubmitState() {
    const complete = form.checkValidity();
    submitBtn.disabled = sending || submitted || !complete;
    if(readyNote){
      const message = submitted
        ? 'Your application has been received.'
        : sending
          ? 'Your application is being sent. Please wait.'
          : complete
            ? 'All required fields are complete. You can submit your application.'
            : 'Complete all required fields to enable submission.';
      if(readyNote.textContent !== message) readyNote.textContent = message;
    }
  }
  const addButton = document.querySelector('#add-device');
  let nextId = 0;
  const maxDevices = 3;

  function makeOption(value, text) {
    const item = document.createElement('option'); item.value = value; item.textContent = text || value; return item;
  }
  function makeField(labelText, id, name, options, placeholder, required = false) {
    const wrapper = document.createElement('div'); wrapper.className = 'device-field';
    const label = document.createElement('label'); label.htmlFor = id; label.textContent = labelText;
    if (required) { const marker = document.createElement('span'); marker.className = 'required-indicator'; marker.textContent = ' *'; label.append(marker); }
    const select = document.createElement('select'); select.id = id; select.name = name; select.required = required;
    const prompt = makeOption('',placeholder);prompt.disabled = true;prompt.selected = true;select.append(prompt);
    options.forEach(v => select.append(makeOption(v)));
    wrapper.append(label,select);return { wrapper,select };
  }
  function refreshAddButton(){ addButton.hidden = devices.children.length >= maxDevices; }
  function addDevice() {
    if (devices.children.length >= maxDevices) return;
    const id = ++nextId;
    const card = document.createElement('div');card.className='device-card';card.dataset.deviceId=String(id);
    const head = document.createElement('div');head.className='device-head';
    const title=document.createElement('strong');title.textContent=id===1?'Primary device':'Additional device';head.append(title);
    if (id>1) { const remove=document.createElement('button');remove.type='button';remove.className='remove-device';remove.textContent='Remove device';remove.addEventListener('click',()=>{card.remove();refreshAddButton();updateSubmitState();});head.append(remove); }
    const grid=document.createElement('div');grid.className='device-grid';
    const type=makeField('Device type','device-'+id+'-type','device_'+id+'_type',types,'Select device type',true);
    const brand=makeField('Manufacturer','device-'+id+'-brand','device_'+id+'_manufacturer',Object.keys(catalog),'Select manufacturer',true);
    const model=makeField('Device model','device-'+id+'-model','device_'+id+'_model',[],'Select a manufacturer first',true);
    const version=makeField('Android version','device-'+id+'-version','device_'+id+'_android_version',androidVersions,'Select version',true);
    const manual=document.createElement('div');manual.className='device-field';manual.hidden=true;
    const ml=document.createElement('label');ml.textContent='Enter exact model';ml.htmlFor='device-'+id+'-custom';
    const mi=document.createElement('input');mi.id='device-'+id+'-custom';mi.name='device_'+id+'_custom_model';mi.placeholder='e.g. Pixel 8 Pro, Galaxy A35, Lenovo Tab...';mi.maxLength=130;manual.append(ml,mi);
    const fillModels=()=>{
      const chosenBrand=brand.select.value,chosenType=type.select.value;
      const possible=(catalog[chosenBrand] && catalog[chosenBrand][chosenType]) || [];
      model.select.replaceChildren();const prompt=makeOption('',chosenBrand&&chosenType?'Select your model':'Choose device type and manufacturer');prompt.disabled=true;prompt.selected=true;model.select.append(prompt);
      possible.forEach(v=>model.select.append(makeOption(v)));
      model.select.append(makeOption('Other / not listed'));
      if (chosenBrand==='Other manufacturer' || chosenType==='Other Android device')model.select.value='Other / not listed';
      toggleManual();
    };
    const toggleManual=()=>{const isOther=model.select.value==='Other / not listed';manual.hidden=!isOther;mi.required=isOther; if(!isOther)mi.value='';};
    type.select.addEventListener('change',fillModels);brand.select.addEventListener('change',fillModels);model.select.addEventListener('change',toggleManual);
    grid.append(type.wrapper,brand.wrapper,model.wrapper,version.wrapper);card.append(head,grid,manual);devices.append(card);refreshAddButton();updateSubmitState();
  }
  addButton.addEventListener('click',addDevice);
  addDevice();
  // React to edits, dropdown changes, consent, added/removed devices, and browser autofill.
  form.addEventListener('input',updateSubmitState);
  form.addEventListener('change',updateSubmitState);
  window.addEventListener('pageshow',updateSubmitState);
  updateSubmitState();
  const feedback=document.querySelector('#form-feedback');
  const demo=document.querySelector('#demo-notice');
  if(isLive){demo.hidden=true;submitBtn.firstChild.nodeValue='Submit application ';}
  function setFeedback(message,kind){feedback.textContent=message;feedback.className='form-feedback is-'+kind;feedback.focus({preventScroll:false});}
  function clearFeedback(){feedback.textContent='';feedback.className='form-feedback';}
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(sending || submitted) return;
    clearFeedback();
    if(!form.checkValidity()){updateSubmitState();form.reportValidity();return;}
    if(!isLive){
      setFeedback('Preview complete. Your answers have not been submitted.','success');
      return;
    }

    sending=true;
    updateSubmitState();
    submitBtn.firstChild.nodeValue='Sending application ';
    try{
      const response=await fetch(endpoint,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
      if(!response.ok){
        let message='The application could not be sent. Please try again.';
        try{
          const json=await response.json();
          if(Array.isArray(json.errors)) message=json.errors.map(x=>x.message).filter(Boolean).join(' ')||message;
        }catch(_e){}
        throw new Error(message);
      }
      // Only show the dedicated confirmation page after Formspree accepts the application.
      submitted=true;
      window.location.assign('thank-you.html');
    }catch(error){
      if(!submitted) setFeedback(error.message||'We could not send your application. Please try again.','error');
    }finally{
      sending=false;
      if(!submitted) submitBtn.firstChild.nodeValue='Submit application ';
      updateSubmitState();
    }
  });
})();