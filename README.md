# NutriChain - QuackHacks 2020

[Akash Veerappan](https://github.com/Akash2002) <br>
[Anthony Ahn](https://github.com/aahn33) <br>
[Rohan Agarwal](https://github.com/roaga) <br>

Copyrights Reserved. 2020.

### Inspiration
-----------------
In 2018 alone, more than 35 million people in the US were food insecure, with over 4.6 million being extremely insecure. Even though food banks try to supply food to as many people as possible, satisfying the needs of the entire food-insecure population is far from feasible at the moment. What’s more? Many people, especially younger generations, feel a social stigma attached to food banks and to having to show up and receive charity. Furthermore, during such a tough time as the COVID-19 pandemic, we wanted to develop a solution that would ease the food insecurity of millions of households in America and around the world. By providing a sustainable delivery system that relies on the free will of the people, food banks can divert their limited resources to where it's most impactful while reaching more people than ever before.

### Solution
----------------
We want to revolutionize how food banks work. We want to open up a new world of volunteer-based doordash for the misfortunate of society. That is exactly what we have done. We present to you NutriChain, a mobile app for practically everyone, both food banks and individuals. A food bank simply registers with their meal plan, and once a particular family/individual places an order, volunteers come together to deliver the food at their convenience while each spending minimal time. This stems from our unique chained delivery system.
##### Process
First, a user orders a meal from a foodbank. The foodvbank processes the order, waiting for any pick-up requests. Person A issues a pick-up request from their home, picks up the food, and brings it to their home. Person B issues a pick-up request to pick up the food from Person A's home. This chain continues until the chain has reached near the original orderer, at which point they can conveniently pick up their free food. This chaining method allows for delivery over long distances with negligble investment of resources or time from any party, minimizing operating costs and maximizing community impact.

### Challenges 
--------------------

Two of us had no prior experience with React Native, so learning the fundamentals and speed-coding for the next 24 hours was difficult. Managing asynchronous Firebase calls was yet another crucial concept that needed proper understanding. Finally, working through the mathematics of the location algorithm to filter who would see which pick-up requests based on their proximity to a path toward the end desination needed some debugging and thought. Yet over these 24 hours, we collaborated on these tasks and persevered to develop a complete working product that addresses our concerns with the existing food bank system. 

### Technicalities
-------------------
We have used Firebase Firestore to manage data from the cloud and Firebase Authentication to manage the two user types (food bank and individual). We built the entire app with React Native and JavaScript to allow for cross-platform compatibility. 

### Accomplishments that we're proud of
------------------------------------------------
We are especially proud of the fact that given two of us didn't know React Native and one of us didn't know JavaScript at all, we were able to come together and collaborate effectively. By focusing on different aspects of the app in parallel, we were able to finish the application with ample time left to plan our presentation. We are simply happy that we were able to address a genuine problem that bothers millions in our country and across the globe. 

### What's Next
---------------------
There are several features that we would like to develop in the future for NutriChain. 
1. Food bank verification - Verify if a food bank is a valid foodbank with manual expert processing
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
