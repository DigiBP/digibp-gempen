# DigiBP Gempen Incident Management :computer:
```    ___          ___          ___          ___          ___          ___     
     /\  \        /\  \        /\__\        /\  \        /\  \        /\__\    
    /::\  \      /::\  \      /::|  |      /::\  \      /::\  \      /::|  |   
   /:/\:\  \    /:/\:\  \    /:|:|  |     /:/\:\  \    /:/\:\  \    /:|:|  |   
  /:/  \:\  \  /::\~\:\  \  /:/|:|__|__  /::\~\:\  \  /::\~\:\  \  /:/|:|  |__ 
 /:/__/_\:\__\/:/\:\ \:\__\/:/ |::::\__\/:/\:\ \:\__\/:/\:\ \:\__\/:/ |:| /\__\
 \:\  /\ \/__/\:\~\:\ \/__/\/__/~~/:/  /\/__\:\/:/  /\:\~\:\ \/__/\/__|:|/:/  /
  \:\ \:\__\   \:\ \:\__\        /:/  /      \::/  /  \:\ \:\__\      |:/:/  / 
   \:\/:/  /    \:\ \/__/       /:/  /        \/__/    \:\ \/__/      |::/  /  
    \::/  /      \:\__\        /:/  /                   \:\__\        /:/  /   
     \/__/        \/__/        \/__/                     \/__/        \/__/    
```

## License

- [Apache License, Version 2.0](https://github.com/DigiBP/digibp-archetype-camunda-boot/blob/master/LICENSE)

                                                                   

*Authors*
* Rafael R.
* Resheka D.
* Roland H.
* Oliver F.
* David M. 

# Quicklinks
Camunda Platform - https://gempen.herokuapp.com 
* Login: helpdeskagent / helpdeskagent

Incident Reporting Form - https://gempen.herokuapp.com/triage.html 
* See “instructions for Testing”


# Summary
As part of the group assignment in Digitalization of Business Processes at FHNW Spring Semester 2019, we designed a smart incident management assistant. This repository contains the workflow which is running on Camunda.
A summary of the business case, as well as the goals of the project, is provided in the following:

Business Case in a nutshell:
* An international business environment with multiple languages spoken
* Centralized helpdesk (only speaking English)
* Helpdesk workload increased massively in the past years 
* A lot of standard problems occur (e.g. „PC is slow“)

Goals:
* Centralize & standardize helpdesk process
* Build standardized user-interface to create incident requests
* Handle multilanguage support
* Take advantage of a chatbot to solve standard request in an automized manner
* Ensure priority support for VIP-employees or urgent requests

For details, see the separate chapters.


# Methodology and Approach
We started the project outlining the corner parts of the whole process. To add complexity, we implemented a chatbot with the ability to translate from different languages to find a solution and give back a possible solution in the user’s language. 
We used the agile approach with weekly sprints.


# Design Approach
We started our journey designing process and decision table using Camunda, we walked through cloud services, deployment tools, and integrations, and we finally ended up on AI and chatbot. 
Some of the gathered knowledge in the semester was used to build the solution presented here; more technical details about each tool utilized can be found below.


# Collaboration
For collaboration, we used different platforms; at first, GitHub version control was used to manage the technical files like processes modeling, decision tables, and data about our integration services.
As indicated on the assignment, to guarantee a flawless integration, we used one instance of Heroku and one GitHub repository.
The integration part is managed on Integromat in different scenarios.

# Process Description (Incident Management)
Our context is the Gempen Company, which replaced the local IT support with an outsourced help desk, which is abroad. These helpdesk agents are English speaking only.
In this new model, Gempen Company trained a few IT analysts to remain on site as VIP support; the VIP support service consists of a small pool of specialists that share the infrastructure. Moreover, monitoring daily activities. They have a high level of English, and politeness, which is needed if they need to talk to high hierarchy level managers in the company. Important to mention is that both outsourced and on-site helpdesk agents inherit the same role on the Incident management process; the only difference is personal or remote assistance.
We developed a smart incident management tool that consists of a chatbot that proposes predefined solutions, classifies the priority according to the info given by the employee, and creation of an incident ticket.


![BPMN model of the overall process](src/main/resources/doc/incident_process.png)

To start a new issue request, you have to fill out the web-form (https://gempen.herokuapp.com/triage.html). Type if you are on site and if the issue is stopping you from working and if it is compliance relevant because the issue is making the company vulnerable.


## Main Phases
The process is divided into three phases:

![Triage process](src/main/resources/doc/triage_process.png)

In the first phase, the decision is made if either the user has to use the chatbot or is eligible for VIP support.


2.	Ticket creation process
In this process the creation of a ticket, either open or closed is described.


![Ticket creation process](src/main/resources/doc/ticket_creation_process.png)



If the problem was solved by the chatbot, a closed ticket is created. If it is a VIP or the problem could not be solved by the chatbot, an open ticket is created and an confirmation mail is sent to the user.
a)	VIP or chatbot: If the problem is unresolved, an ‘open’ ticket is automatically created which is added to the list for the helpdesk team. They then call the user back.
b)	Chatbot: If the problem is solved, the user selects [Problem solved], a ‘closed’ ticket is automatically created – To reduce information overload, no e-mail is sent to the customer because he already knows that the issue is resolved.


3.	Diagnosis and Solving Process
Diagnosis Process (with knowledge base, translation and solving)


![Diagnosis and solving process](src/main/resources/doc/diagnosis_and_solving_process.png)

In the second phase, the flow is depending on the language the issue reporter is speaking. If it is not English, a translation of the request is done by invoking an external service before sending the request to the support staff. 
After that the knowledge base is consulted before solving the ticket issue.


4.	Closing Process
The following image shows a comprehensive visualization of our closing process.

![Diagnosis and solving process](src/main/resources/doc/closing_process.png)



## Roles
We have defined two roles in our process; one is the incident reporter, the other the helpdesk agent who solves the issue.

### Incident reporter
The issue is commonly created as incident management. The incident reporter usually is the end-user who has an issue she or he wants to report to the helpdesk staff. The initial process creates a ticket that describes the issue details depending on the hierarchy level. The incident reporter correspondingly gets an e-mail as the feedback on how is the issue is getting proceeded. If the incident reporter needs VIP support, then it is done immediately, or with less hierarchy level leads to the chatbot. Once the issue is solved, the ticket is closed, and the confirmation is sent by email to the incident reported (i.e., end-user).

### Helpdesk Agent
The helpdesk agent plays a major role in our process. Depending on the requester's hierarchy level, the helpdesk agent goes directly to the person. This level of support is reserved for VIPs only. If the issue has an impact on compliance, and it is preventing the requester from work, he or she also gets VIP treatment from the helpdesk agent. The high priority ensures to assist ‘ VIP’ support to resolve the issue in person if the hierarchy level is >=5. The helpdesk agent reacts immediately, especially on a high priority level. All other requests are directed to our chatbot. If the answer to the chatbot is not satisfactory, a ticket is created for the helpdesk agent. Here the helpdesk agent has to call back the requester.


# Architecture
An HTML-Webform has been developed as a standardized user interface for employees to submit incident requests. When a user has filled in his initial information, the process engine is triggered, and the process gets started. After that, either the chatbot or the priority form is shown on the web form user front-end. Local JavaScript code handles the client-side logic as well as the communication with the process engine via REST. To embed the Chatbot in the website, a framework to handle Dialogflow request has been developed.
After the employee has provided the necessary data, and the process has been started, the Camunda process engine uses REST to automize process steps with Integromat as a backend integration layer. Integromat itself makes use of several web services such as Google-Docs and Yandex for on the fly translation of German hotline tickets.


![Diagnosis and solving process](src/main/resources/doc/overall_architecture.png)

The illustration shows the overall architecture design of our incident management process.



# Subprocesses Description (Technical Details)
We used Google Sheets to store and retrieve data. The data is used in various variables throughout the process.


## Technology
The following technologies has been used for implementing the process.

| Technology  | Description |
| ------------- | ------------------ |
|Camunda Modeler  | The Camunda Modeler is used to create BPMN and DMN models. |
|Camunda Platform | |
|Standard Web Technologies | HTML, CSS and JavaScript is used to create the webfronted and process flow |
|Integromat |  |
|GitHub| Github is used for collaboration and versioning of the programming code as well as the models. |
|Heroku|Heroku is a PaaS (Platform as a Services) which is used to quickly build, run, and operate the Camunda in the cloud. |
|Yandex Translate API|Heroku is a PaaS (Platform as a Services) which is used to quickly build, run, and operate the Camunda in the cloud. |





