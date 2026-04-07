// digitalFormTree/adapters.js

/**
 * Adapter vrací funkce, které renderer volá.
 * V design režimu většina věcí jen mění lokální strom.
 * Ve fill režimu to volá thunky + refresh.
 */
export const createDesignerAdapter = ({
  // definicni thunky (pokud chceš zachovat)
  insertFieldDef,
  deleteFieldDef,
  insertSectionDef,
  deleteSectionDef,

  // optional: refresh definice po mutaci
  refresh,
} = {}) => {
  return {
    mode: "design",

    // design: field value je lokální -> renderer to řeší přes onLocalChange
    persistFieldValue: null,

    // design: add/remove child section je lokální -> renderer to řeší přes onLocalChange
    addSubmissionChildSection: null,
    removeSubmissionChildSection: null,

    // design-time ops nad definicí (toolbox)
    addFormFieldDef: async ({ formSectionDef }) => {
      if (!insertFieldDef) return;
      await insertFieldDef({ formsection_id: formSectionDef?.id });
      if (refresh) await refresh();
    },

    removeFormFieldDef: async ({ formFieldDef }) => {
      if (!deleteFieldDef) return;
      await deleteFieldDef({ id: formFieldDef?.id });
      if (refresh) await refresh();
    },

    addFormSectionDef: async ({ parentFormSectionDef }) => {
      if (!insertSectionDef) return;
      await insertSectionDef({ parent_id: parentFormSectionDef?.id });
      if (refresh) await refresh();
    },

    removeFormSectionDef: async ({ formSectionDef }) => {
      if (!deleteSectionDef) return;
      await deleteSectionDef({ id: formSectionDef?.id });
      if (refresh) await refresh();
    },

    refresh: refresh || (async () => {}),
  };
};


export const createFillerAdapter = ({
  // thunky / akce pro fill
  updateSubmissionField,         // (vars) => thunk
  insertSubmissionSection,
  deleteSubmissionSection,
  readSubmission,                // refresh po mutacích

  // CreateDelayer instance (doporučuju vytvořit 1x mimo)
  delayer,

  // gqlClient/dispatch wrapper: typicky useAsyncThunkAction.run nebo vlastní helper
  runThunk,                      // async (AsyncAction, vars) => result
} = {}) => {
  const doRefresh = async (submission_id) => {
    if (!readSubmission || !runThunk) return;
    await runThunk(readSubmission, { id: submission_id });
  };

  return {
    mode: "fill",

    persistFieldValue: async ({ submissionField, nextValue, submission }) => {
      if (!updateSubmissionField || !runThunk) return;

      const job = async () => {
        await runThunk(updateSubmissionField, {
          id: submissionField?.id,
          value: nextValue,
        });
        await doRefresh(submission?.id);
      };

      if (delayer) {
        delayer.Call(job);
      } else {
        await job();
      }
    },

    addSubmissionChildSection: async ({ parentSubmissionSection, childFormSectionDef, submission }) => {
      if (!insertSubmissionSection || !runThunk) return null;

      const result = await runThunk(insertSubmissionSection, {
        parent_id: parentSubmissionSection?.id,
        formsection_id: childFormSectionDef?.id,
        submission_id: submission?.id,
      });

      await doRefresh(submission?.id);
      return result;
    },

    removeSubmissionChildSection: async ({ childSubmissionSection, submission }) => {
      if (!deleteSubmissionSection || !runThunk) return;

      await runThunk(deleteSubmissionSection, { id: childSubmissionSection?.id });
      await doRefresh(submission?.id);
    },

    refresh: async ({ submission }) => doRefresh(submission?.id),
  };
};
