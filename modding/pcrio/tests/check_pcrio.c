
#include <check.h>
#include <string.h>
#include <stdlib.h>
#include <memory.h>
#include "../pcrio.h"

#define LANG_EN 1033

#define L_AOE "lang/aoe/language.dll"
#define L_AOK "lang/aok/language.dll"

// TODO get_stringL test errors

struct pcr_file * test_read_file(const char *filename, pcr_error_code *err)
{
  struct pcr_file *pcr_file = NULL;

  pcr_file = pcr_read_file(filename, err);

  fail_unless (PCR_SUCCESS(*err), "failed to read %s", filename);

  return pcr_file;
}

void test_check_string(struct pcr_file *pf, uint32_t id, int32_t lang, const char *str)
{
  char *buff = NULL;
  int buff_size;
  
  buff_size = pcr_get_strlenL(pf, id, lang) + 1;
  
  buff = (char *)malloc(sizeof(char) * buff_size);
  
  pcr_get_stringL(pf, id, lang, buff, buff_size);
  
  fail_if(pcr_get_stringL(pf, id, lang, buff, buff_size) != 0, NULL);
  
  fail_unless(strcmp(buff, str) == 0, 
              "Read string: \"%s\" differs from: \"%s\".", buff, str);
  
  free(buff);
}

void test_read_only(const char *filename)
{
  pcr_error_code err = PCR_ERROR_NONE;
  pcr_free(test_read_file(filename, &err));
}


START_TEST (test_pcrio_read)
{
  test_read_only(L_AOE);
  test_read_only(L_AOK);
  test_read_only("lang/aok/language_x1.dll");
  test_read_only("lang/aok/language_x1_p1.dll");
  test_read_only("lang/sw/language.dll");
  test_read_only("lang/sw/language_x1.dll");
}
END_TEST

START_TEST (test_pcrio_pcr_get_string)
{
  pcr_error_code err = PCR_ERROR_NONE;
  struct pcr_file *pf = NULL;
  
  pf = test_read_file(L_AOK, &err);
  
  // random read test
  fail_unless(pcr_get_strlenL(pf, 4488, pcr_get_default_language(pf)->id) == 14, NULL);
  fail_unless(pcr_get_strlen(pf, 4488) == 14, NULL);
  
  const struct pcr_language *lang = pcr_get_default_language(pf);
  
  char *buff = (char *)malloc(sizeof(char) * 20);
  
  fail_unless(pcr_get_stringL(pf, 4488, lang->id, buff, 20) == 0, NULL);
  fail_unless(strcmp(buff, "Takeda Shingen") == 0, NULL);
  
  buff[3] = '\0';
  buff[4] = '\0';
  
  fail_unless(pcr_get_stringL(pf, 4488, lang->id, buff, 4) == 0, NULL);
  fail_unless(strcmp(buff, "Take") == 0, NULL);
  
  fail_unless(pcr_get_stringL(pf, 4488, 1234, buff, 15) == 0, NULL);
  fail_unless(strlen(buff) == 0, NULL);
  
  int i;
  for (i=0; i<15; i++)
    fail_if(buff[i] != '\0', NULL);
  
  free(buff);
  pcr_free(pf);
}
END_TEST 


START_TEST (test_pcrio_rw_strings)
{
  pcr_error_code err = PCR_ERROR_NONE;
  struct pcr_file *pf = NULL;
  
  pf = test_read_file(L_AOE, &err);
  
  struct pcr_language lang = *pcr_get_default_language(pf);
  
  pcr_set_stringC(pf, 9999, lang, "test");
  
  pcr_write_file("out.dll", pf, &err);
  
  fail_unless(PCR_SUCCESS(err), NULL);
  
  pcr_free(pf);
  
  pf = test_read_file("out.dll", &err);
  
  test_check_string(pf, 101, LANG_EN, "1");
  test_check_string(pf, 54518, LANG_EN, "Click to order units to repair a building or boat.");
  test_check_string(pf, 9999, LANG_EN, "test");
  
  const struct language_info_array *ci_arr = pcr_get_language_info(pf);
  
  fail_unless(ci_arr->count == 1, NULL);
  fail_unless(ci_arr->array[0].lang.id == LANG_EN, NULL);
  
}
END_TEST

START_TEST (test_pcrio_aok_stress)
{
  pcr_error_code err = PCR_ERROR_NONE;
  struct pcr_file *pf = NULL;
  
  pf = test_read_file(L_AOK, &err);
  
  uint32_t index = 64000;
  struct pcr_language lang = *pcr_get_default_language(pf);
  
  for (; index < 70000; index++)
    pcr_set_stringC(pf, index, lang, "testtesttest");
  
  pcr_write_file("out_big_aok.dll", pf, &err);
  pcr_free(pf);
  
  pf = test_read_file("out_big_aok.dll", &err);
  
  for (index = 64000; index < 70000; index++)
    test_check_string(pf, index, LANG_EN, "testtesttest");
  
  
  for (index = 64000; index < 70000; index++)
    pcr_set_stringC(pf, index, lang, "");
  
  pcr_write_file("not_so_big_aok.dll", pf, &err);
  
  fail_unless(PCR_SUCCESS(err), NULL);
  
  pcr_free(pf);
  
}
END_TEST

START_TEST (test_pcrio_get_codepage)
{
  pcr_error_code err = PCR_ERROR_NONE;
  struct pcr_file *pf = NULL;
  
  pf = test_read_file(L_AOK, &err);
  
  fail_unless(pcr_get_codepage(pf, 4488) == 0, NULL);
  fail_unless(pcr_get_codepageL(pf, 4488, LANG_EN) == 0, NULL);
  
  fail_unless(pcr_get_codepage(pf, 1010) == 0, NULL); // no string, but lang dir
  fail_unless(pcr_get_codepage(pf, 70000) == 0, NULL); // no string, no lang
  
  fail_unless(pcr_get_codepageL(pf, 70000, 1234) == (unsigned)PCR_RET_ERR_LANG_NOT_SET, NULL);
  
  
  pcr_free(pf);
}
END_TEST

Suite * pcrio_suite (void)
{
  Suite *s = suite_create ("pcrio");

  TCase *tc_core = tcase_create("Core");
  tcase_add_test(tc_core, test_pcrio_read);
  tcase_add_test(tc_core, test_pcrio_rw_strings);
  tcase_add_test(tc_core, test_pcrio_aok_stress);
  tcase_add_test(tc_core, test_pcrio_pcr_get_string);
  tcase_add_test(tc_core, test_pcrio_get_codepage);
  suite_add_tcase(s, tc_core);

  return s;
}

int main(void)
{
  int number_failed;

  Suite *s = pcrio_suite();
  SRunner *sr = srunner_create(s);
  srunner_run_all(sr, CK_NORMAL);
  number_failed = srunner_ntests_failed(sr);
  srunner_free(sr);

  return (number_failed == 0) ? 0 : -1;
}

