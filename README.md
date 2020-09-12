# NutriChain - QuackHacks 2020

[Akash Veerappan](https://github.com/Akash2002) <br>
[Anthony Ahn](https://github.com/aahn33) <br>
[Rohan Agarwal](https://github.com/roaga) <br>

Copyrights Reserved. 2020.

### Inspiration
-----------------
In 2018 alone, more than 35 million people in the US were food insecure, with over 4.6 million having very low food security. Even though food banks try to supply food to as many people as possible, satisfying the needs of an entire food-insecure population is far from reality. What’s more? Younger generation feels a social stigma attached to food banks – of having to drive by foodbanks to get food. Heck, even older population! Furthermore, during such a tough time with Covid, we wanted to develop a solution that would ease the food insecurity of millions of not only American households, but also homes across the world. By providing a sustainable delivery system that relies on the free will of the people, foodbanks can expend the money they spend on delivery on securing food resources during a time of relative food scarcity and insecurity

### Solution
----------------
We want to revolutionize how food banks work. We want to open up a new world of volunteer-based doordash for the lower sectors of society instead of having trucks deliver packages of food throughout the country, and that is exactly what we have done. We present to you NutriChain. A mobile app for practically everyone including food banks and individuals, where a food bank simply registers with their meal plan, and once a particular family/individual places an order, volunteers come together to deliver the food at their convenience while each spending minimal time as the delivery is a chain of volunteers and not just one person.  
##### Process
First the user who wants food orders it from the foodbank. The foodbank processes the order, waiting for any pickup requests. Person A issues a pickup request from their home and picks up the food and brings it to their home. Person B issues a pickup request to pickup the food from Person A's home. Finally the user picks up from Person B's home at gets his food. Why this system you might ask. Why chain the delivery when it could be a simple truck going around? First this delivery system has little to no operating costs from any party, be it the foodbank or the individual other than their time and dedication. This way, the foodbanks can operate more effectively as non-profits and direct the saved funds towards acquiring food resources especially during this time when left over groceries are scarce due to Covid. Also, foodbanks aren’t like restaurants dispersed everywhere. With delivery chaining, we address long distance delivery without significant investment from any intermediary. 

### Challenges 
--------------------

Two of us had no experience with React-Native at all, so learning the fundamentals and speed-coding for the next 24 hours was tricky. Managing asynchronous firebase calls were a hassle, as we had to work with JavaScript Promises, await, and async. Finally, working through the mathematics of the location algorithm to filter who would see the pickup requests based on how close they were to the pickup location needed some debugging and thought. Over the 24 hours though, we collaborated on these tasks and persevered to develop a complete working product that addresses our concerns with the existing food bank system. 

### Technicalities
-------------------
We have used Firebase Firestore to manage data from the cloud, and Firebase Authentication to manage the two users (foodbank or individual). We have built the entire app on React Native and JS to allow for cross-platform compatibility. 

### Accomplishments that we're proud of
------------------------------------------------
We are especially proud of the fact that given two of us didn't know React-Native and one of us didn't know JavaScript at all we were able to come together and collaborate effectively. By focusing on different aspects of the app parallelly, we were able to finish the application with ample time left to plan our presentation. We are simply happy that we were able to address a genuine problem that bothers millions in our country and across the globe. 

### What's Next
---------------------
There are several features that we would like to develop in the future for NutriChain. 
1. Food bank verification - Verify if a foodbank is a valid foodbank with manual expert processing
2. Priority Chaining - Enhance chaining by presenting the highest priority chain (ie. a chain that is close to completing) over others
3. Geofencing - Enable geofencing to show requests only to those within a certain radius of the foodbank and of the homes of the intermediaries 
4. Notifications - Push notifiations through native APIs or Twilio mobile APIs 
5. Scalable tokens - Modify tokens to proportionally scale with distance taken to deliver 
6. Estimated time - Provide estimated time order dashboard to finish delivering
7. Custom distance delivery - Allow users to take it beyond their homes, ie. enable users to travel a greater distance and earn more tokens
8. UI aesthetic - Improve product aesthetic and user interface experience
9. Social login - Provide accessible social logins, such as Google, Facebook etc.
10. Official Support - Finally we want to be able to get the support of our very own ACFB (Atlanta Community Food Bank)

### More Information
---------------------
For more information, please view our [presentation](https://gtvault-my.sharepoint.com/:p:/g/personal/aveerappan8_gatech_edu/EZOoYldBydVLjBT41Sl8hkwB7Cl22TUj6seIfZnMcBkWPA?e=IPdpVL) and our [Github](https://github.com/roaga/QuackHacks2020) repository.
