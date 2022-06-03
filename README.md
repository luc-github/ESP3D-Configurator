# ESP3D-Configurator

Test Project to use Github action and issue form template as ESP3D configuator.

Expected workflow:

1.   Ask user to answer all questions included in issue template using issue form [Doc](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema)
2.   Convert the form from issue to configuration.h using github-action [Doc](https://github.community/t/get-contents-body-of-issue-in-action/136057/2)
3.   Generate automaticaly configuration.h in issue comment
    a.  As text  in comment [Doc](https://github.com/actions/github#commenting-on-an-issue)
    b.  As attached file [Doc](https://github.com/actions/upload-artifact)

I would like to do the `b` but when currently generating the file is easy, unfortunatly there is not programmaticaly way to get the path to the generated file, see open ticket https://github.com/actions/upload-artifact/issues/50
which is opened for years already

## Current status
1 -  what trigger the scripts ? 👍
  * It is new issue  
  * It has specific label e,g: `configuration`   
  
2 - Generate template form =>To be done  
3 - Extract informations from issue to create configuration.h => To be done  
4 - Generate Issue with configuration.h content
  * As plain text 👍
  * As attached file 😞

Not difficult so hope to finish that soon 😙
